import "./CreateGiftbox.css";
import GiftboxDetails from "../../Components-admin/giftbox-admin/GiftboxDetails/GiftboxDetails";
import GiftboxSummary from "../../Components-admin/giftbox-admin/GiftboxSummary/GiftboxSummary";
import SelectedItems from "../../Components-admin/giftbox-admin/SelectedItems/SelectedItems";

export default function CreateGiftbox() {
  return (
    <div className="create-giftbox-page">
      <div className="page-heading">
        <h1>Create New Giftbox</h1>
        <p className="muted">Add items to create a custom giftbox</p>
      </div>

      <div className="content-grid">
        <div className="left-col">
          <GiftboxDetails />
          <SelectedItems />
        </div>
        <div className="right-col">
          <GiftboxSummary />
        </div>
      </div>
    </div>
  );
}