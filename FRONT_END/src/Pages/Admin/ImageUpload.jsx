import { useState } from "react";
import { adminApi, getErrorMessage, imageSrc } from "../../Service/api";

// Pick a picture -> it is uploaded straight away -> we get back a link like /images/xxx.jpg
// The form then saves that link in the database.
export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";   // so choosing the same file again still works
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image is too big (max 5MB)");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const res = await adminApi.uploadImage(file);
      onChange(res.data.url);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="img-upload">
      <div className="img-preview">
        {value ? <img src={imageSrc(value)} alt="preview" /> : <span>No image</span>}
      </div>
      <div className="img-actions">
        <label className="admin-btn-light file-btn">
          {uploading ? "Uploading..." : value ? "Change image" : "Upload image"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} disabled={uploading} hidden />
        </label>
        {value && (
          <button type="button" className="admin-btn-text" onClick={() => onChange("")}>
            Remove
          </button>
        )}
        {error && <div className="field-error">{error}</div>}
      </div>
    </div>
  );
}
