import { useGiftbox } from "../../../context-admin/GiftboxContext";
import "./GiftboxDetails.css";

export default function GiftboxDetails() {
  const { details, updateDetails } = useGiftbox();

  const onChange = (e) => {
    const { name, value } = e.target;
    updateDetails({ [name]: value });
  };

  const themes = [
    "Birthday",
    "Anniversary",
    "Congratulations",
    "Thank You",
    "Get Well",
    "Festive"
  ];

  return (
    <section className="card giftbox-details">
      <div className="card-header">
        <h2>Giftbox Details</h2>
      </div>

      <div className="card-body">
        <div className="form-row">
          <label htmlFor="name">
            Giftbox Name <span className="required">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g., Chocolate Lover's Box"
            value={details.name}
            onChange={onChange}
          />
        </div>

        <div className="form-row">
          <label htmlFor="theme">
            Theme <span className="required">*</span>
          </label>
          <select
            id="theme"
            name="theme"
            value={details.theme}
            onChange={onChange}
          >
            <option value="">Select a theme</option>
            {themes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your giftbox..."
            rows={4}
            value={details.description}
            onChange={onChange}
          />
        </div>
      </div>
    </section>
  );
}
