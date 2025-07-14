const FloatingInput = ({ id, type, label, value, onChange }) => (
  <div className="relative w-full">
    <input
      id={id}
      type={type}
      placeholder=" "
      value={value}
      onChange={onChange}
      className="peer w-full bg-transparent placeholder:text-transparent text-slate-700 text-sm border border-slate-200 rounded-xl px-6 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-md focus:shadow"
    />
    <label
      htmlFor={id}
      className="absolute cursor-text bg-white px-1 left-6 top-4 text-slate-500 text-sm transition-all transform origin-left 
        peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500
        peer-focus:-top-2 peer-focus:left-6 peer-focus:text-xs peer-focus:text-slate-400 peer-focus:scale-90
        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-6 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400 peer-[:not(:placeholder-shown)]:scale-90"
    >
      {label}
    </label>
  </div>
);

export default FloatingInput