export function FileUpload({ label = 'Files', multiple = true, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="file"
        multiple={multiple}
        onChange={(e) => onChange?.(Array.from(e.target.files || []))}
        className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border file:text-sm file:font-medium file:bg-white file:hover:bg-gray-50"
      />
    </div>
  )
}


