import { useEffect, useState } from "react";
import { Images } from "lucide-react";
import { vehicleApi, getErrorMessage, imageSrc } from "../../Service/api";
import PackageModal from "./PackageModal";
import "./VehicleSurprise.css";

const money = (n) => "Rs " + Number(n).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// "Vehicle Surprise" - car decoration packages. Tap one to see the photos and book on WhatsApp.
export default function VehicleSurprise() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(null);   // the package shown in the pop-up

  useEffect(() => {
    vehicleApi
      .list()
      .then((res) => setPackages(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrap">
      <h1 className="page-title">Vehicle Surprise</h1>
      <p className="page-sub">
        We decorate their car with balloons, flowers and lights while they are away. Tap a package to see the
        photos and book it on WhatsApp.
      </p>

      {error && <div className="msg msg-error">{error}</div>}
      {loading && <p>Loading...</p>}
      {!loading && !error && packages.length === 0 && <p>New packages are coming soon. Message us on WhatsApp to plan one now.</p>}

      <div className="vs-grid">
        {packages.map((pkg) => (
          <button key={pkg.id} className="vs-card" onClick={() => setOpen(pkg)}>
            <div className="vs-cover">
              {pkg.images?.[0] ? <img src={imageSrc(pkg.images[0])} alt="" /> : <span>No photo yet</span>}
              {pkg.images?.length > 1 && (
                <span className="vs-count">
                  <Images size={14} /> {pkg.images.length}
                </span>
              )}
            </div>
            <div className="vs-body">
              <h2>{pkg.name}</h2>
              <p className="vs-price">{pkg.price != null ? money(pkg.price) : "Price on request"}</p>
              {pkg.description && <p className="vs-desc">{pkg.description}</p>}
              <span className="vs-more">See details</span>
            </div>
          </button>
        ))}
      </div>

      {open && <PackageModal pkg={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
