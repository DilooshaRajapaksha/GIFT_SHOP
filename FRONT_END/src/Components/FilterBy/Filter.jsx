import { useReducer, useEffect } from "react";
import "./Filter.css";

/* ----- data ----- */
const OCCASIONS = ["Birthday", "Anniversary", "Thank You", "Just Because"];
const RECIPIENTS = ["For Her", "For Him", "For Couples"];
const PRICE_RANGES = [
  { id: "0-2000", label: "Rs.0 – Rs.2000", min: 0, max: 2000 },
  { id: "2000-5000", label: "Rs.2000 – Rs.5000", min: 2000, max: 5000 },
  { id: "5000+", label: "Rs.5000+", min: 5000, max: null },
];

/* ----- state ----- */
const initial = { occasions: [], recipients: [], price: null };
function reducer(state, a) {
  switch (a.type) {
    case "toggle":
      return {
        ...state,
        [a.key]: state[a.key].includes(a.value)
          ? state[a.key].filter(v => v !== a.value)
          : [...state[a.key], a.value],
      };
    case "set": return { ...state, [a.key]: a.value };
    case "reset": return initial;
    default: return state;
  }
}

/* ----- tiny building blocks ----- */
function CheckboxList({ legend, name, options, values, onToggle }) {
  return (
    <fieldset className="f-section">
      <legend className="f-legend">{legend}</legend>
      <ul className="f-list">
        {options.map(opt => (
          <li key={opt}>
            <label className="f-row">
              <input
                type="checkbox"
                name={name}
                checked={values.includes(opt)}
                onChange={() => onToggle(opt)}
              />
              <span>{opt}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

function RadioList({ legend, name, options, value, onChange }) {
  return (
    <fieldset className="f-section">
      <legend className="f-legend">{legend}</legend>
      <ul className="f-list">
        {options.map(opt => (
          <li key={opt.id}>
            <label className="f-row">
              <input
                type="radio"
                name={name}
                value={opt.id}
                checked={value === opt.id}
                onChange={() => onChange(opt.id)}
              />
              <span>{opt.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

/* ----- main component ----- */
export default function Filters({ onChange }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => { onChange?.(state); }, [state, onChange]);

  return (
    <aside className="filters">
      <h3 className="f-title">Filter By</h3>

      <CheckboxList
        legend="Occasion"
        name="occasion"
        options={OCCASIONS}
        values={state.occasions}
        onToggle={v => dispatch({ type: "toggle", key: "occasions", value: v })}
      />

      <RadioList
        legend="Price Range"
        name="price"
        options={PRICE_RANGES}
        value={state.price}
        onChange={v => dispatch({ type: "set", key: "price", value: v })}
      />

      <CheckboxList
        legend="Recipient"
        name="recipient"
        options={RECIPIENTS}
        values={state.recipients}
        onToggle={v => dispatch({ type: "toggle", key: "recipients", value: v })}
      />

      <button className="f-clear" onClick={() => dispatch({ type: "reset" })}>
        Clear filters
      </button>
    </aside>
  );
}
