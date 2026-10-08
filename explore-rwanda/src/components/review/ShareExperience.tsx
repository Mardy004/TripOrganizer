import { useState } from "react";
import type { FormEvent } from "react";
import { useAccount } from "../../context/AccountContext";
import { useI18n } from "../../context/I18nContext";
import { reviewService } from "../../services";
import type { ReviewTopic } from "../../types";
import { hasErrors, minLength } from "../../utils/validation";
import type { FieldError } from "../../utils/validation";
import { AccountGate } from "../account/AccountGate";
import { Button } from "../common/Button";
import { FormField } from "../common/FormField";
import { Icon } from "../common/Icon";
import { Modal } from "../common/Modal";

const TOPICS: ReviewTopic[] = [
  "family_friendly",
  "difficulty",
  "weather",
  "accessibility",
  "food",
  "safety",
  "photography",
  "nature",
  "value",
];

type Target = { targetType: "destination" | "organizer"; targetId: string };

function ReviewForm({ target, onDone }: { target: Target; onDone: () => void }) {
  const { t } = useI18n();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState<ReviewTopic[]>([]);
  const [errors, setErrors] = useState<{ rating?: FieldError; content?: FieldError }>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (topic: ReviewTopic) =>
    setTopics((list) => (list.includes(topic) ? list.filter((x) => x !== topic) : [...list, topic]));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = {
      rating: rating > 0 ? undefined : ({ key: "error.rating" } as FieldError),
      content: minLength(content, 20),
    };
    setErrors(found);
    if (hasErrors(found)) return;
    setBusy(true);
    await reviewService.submit({ ...target, rating, content: content.trim(), topics });
    setBusy(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="form-success" role="status">
        <h3 className="t-h3">{t("reviews.thanksTitle")}</h3>
        <p>{t("reviews.thanksText")}</p>
        <Button variant="dark" onClick={onDone}>
          {t("common.close")}
        </Button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <fieldset className={`rate ${errors.rating ? "rate--error" : ""}`}>
        <legend>{t("reviews.rating")}</legend>
        <div className="rate__options">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className={`rate__opt ${rating >= n ? "is-on" : ""}`}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => {
                  setRating(n);
                  setErrors((er) => ({ ...er, rating: undefined }));
                }}
              />
              <Icon name="star" size={28} filled={rating >= n} />
              <span className="visually-hidden">{t("reviews.ratingOption", { n })}</span>
            </label>
          ))}
        </div>
        {errors.rating && (
          <p className="field__error" role="alert">
            {t(errors.rating.key)}
          </p>
        )}
      </fieldset>

      <FormField id="rv-content" label={t("reviews.text")} hint={t("reviews.textHint")} required error={errors.content}>
        {(c) => (
          <textarea
            {...c}
            rows={4}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setErrors((er) => ({ ...er, content: undefined }));
            }}
          />
        )}
      </FormField>

      <fieldset className="topics">
        <legend>
          {t("reviews.topics")} <span className="field__opt">({t("common.optional")})</span>
        </legend>
        <div className="topics__list">
          {TOPICS.map((topic) => (
            <label key={topic} className={`chip chip--sm ${topics.includes(topic) ? "chip--on" : ""}`}>
              <input type="checkbox" checked={topics.includes(topic)} onChange={() => toggle(topic)} />
              {t(`topic.${topic}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <Button type="submit" size="lg" block disabled={busy}>
        {t("reviews.submit")}
      </Button>
    </form>
  );
}

/**
 * "Share your experience". Needs an account: visitors see why, create one, and continue straight
 * to the form.
 */
export function ShareExperience({ target, label }: { target: Target; label?: string }) {
  const { t } = useI18n();
  const { user } = useAccount();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {label ?? t("reviews.share")}
      </Button>
      <AccountGate open={open && !user} onClose={close} title={t("reviews.gateTitle")} text={t("reviews.gateText")} />
      <Modal open={open && !!user} onClose={close} title={t("reviews.composeTitle")}>
        <ReviewForm target={target} onDone={close} />
      </Modal>
    </>
  );
}
