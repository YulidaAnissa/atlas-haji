// components/StatusCard.jsx


export default function StatusCard({ title, count, subtitle, color, icon }) {
  return (
    <div className={`rounded-lg shadow-md p-4 ${color} text-white w-full`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="text-4xl font-bold">{count}</p>
      <p className="text-sm">{subtitle}</p>
    </div>
  );
}
