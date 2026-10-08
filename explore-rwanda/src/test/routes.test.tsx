// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AccountProvider } from "../context/AccountContext";
import { I18nProvider } from "../context/I18nContext";
import { en } from "../translations/en";
import { rw } from "../translations/rw";
import { isInterpreted, parseSearch } from "../utils/search";
import { costFrom } from "../utils/cost";
import { destinations } from "../data/mock/destinations";

window.scrollTo = () => {};
afterEach(() => {
  cleanup();
  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }
});

const renderAt = (path: string) =>
  render(
    <I18nProvider>
      <AccountProvider>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </AccountProvider>
    </I18nProvider>,
  );

const T = (key: keyof typeof en) => new RegExp(en[key].replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\{\w+\\\}/g, ".*"));

describe("routes render", () => {
  const cases: [string, RegExp][] = [
    ["/", T("home.upcoming.title")],
    ["/explore", T("explore.subtitle")],
    ["/destinations", T("explore.destTitle")],
    ["/destinations/ibere-rya-bigogwe", T("cost.eyebrow")],
    ["/destinations/nope", T("state.notFoundDest")],
    ["/trips", T("trips.title")],
    ["/trips/t-nyandungu-1010", T("trip.register")],
    ["/trips/t-kivu-1024", T("trip.full")],
    ["/trips/t-nyandungu-1014", T("trip.closed")],
    ["/trips/t-nyandungu-1010/register", T("reg.required")],
    ["/trips/nope", T("trip.notFound")],
    ["/organizers", T("org.title")],
    ["/organizers/o-nope", T("org.notFound")],
    ["/organize", T("become.title")],
    ["/organize/request", T("apply.gateTitle")],
    ["/saved", T("saved.guestTitle")],
    ["/about", T("about.title")],
    ["/organizer/trips", T("placeholder.organizer")],
    ["/admin/reviews", T("placeholder.admin")],
    ["/zzz", T("state.notFoundPage")],
  ];
  it.each(cases)("%s", async (path, re) => {
    renderAt(path);
    expect((await screen.findAllByText(re, {}, { timeout: 4000 })).length).toBeGreaterThan(0);
  });
});

describe("behaviour", () => {
  it("switches language to Kinyarwanda", async () => {
    renderAt("/about");
    await screen.findAllByText(T("about.title"));
    fireEvent.click(screen.getAllByRole("button", { name: /RW/ })[0]);
    expect((await screen.findAllByText(rw["about.title"])).length).toBeGreaterThan(0);
  });

  it("shows entry fee prominently and origin change updates estimate", async () => {
    renderAt("/destinations/ibere-rya-bigogwe");
    await screen.findAllByText(T("cost.eyebrow"));
    fireEvent.click(screen.getByLabelText(en["origin.Mahoko"]));
    expect((await screen.findAllByText(T("cost.from"))).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByLabelText(en["origin.Other"]));
    expect(await screen.findByText(T("cost.otherNote"))).toBeTruthy();
  });

  it("gates registration behind a short account form", async () => {
    renderAt("/trips/t-nyandungu-1010/register");
    expect((await screen.findAllByText(T("reg.required"))).length).toBeGreaterThan(0);
  });

  it("does not allow registering for a full trip", async () => {
    renderAt("/trips/t-kivu-1024/register");
    expect(await screen.findByText(T("reg.notOpen"))).toBeTruthy();
  });

  it("explains why an account is needed for saving", async () => {
    renderAt("/saved");
    expect((await screen.findAllByText(T("account.when.save"))).length).toBeGreaterThan(0);
  });

  it("shows an invitation, not an empty block, when a destination has no experiences", async () => {
    const none = destinations.find((d) => !(d.reviewCount ?? 0));
    if (!none) return;
    renderAt(`/destinations/${none.slug}`);
    await waitFor(() => expect(screen.queryAllByText(T("reviews.emptyTitle")).length).toBeGreaterThan(0));
  });
});

describe("logic", () => {
  it("parses conversational searches", () => {
    expect(parseSearch("hiking near Kigali").nearOrigin).toBe("Kigali");
    expect(parseSearch("places under 10,000 RWF").maxBudget).toBe(10000);
    expect(parseSearch("weekend trips").weekend).toBe(true);
    expect(isInterpreted(parseSearch("swimming"))).toBe(true);
  });

  it("never invents entry fees and treats Other as Kigali reference", () => {
    for (const d of destinations) {
      const { summary, isReference } = costFrom(d, "Other");
      expect(isReference).toBe(true);
      if (d.entryFee.kind !== "amount") expect(summary.entryMissing || d.entryFee.kind === "none_known").toBe(true);
    }
  });

  it("has Kinyarwanda for every English key", () => {
    expect(Object.keys(en).filter((k) => !(k in rw))).toEqual([]);
  });
});
