import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type DeviceDatum = {
  name: string;
  value: number;
  color: string;
};

type ClicksByDeviceCardProps = {
  data: DeviceDatum[];
};

export default function ClicksByDeviceCard({ data }: ClicksByDeviceCardProps) {
  const primaryDevice = data.reduce((current, item) => (item.value > current.value ? item : current), data[0]);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 card-shadow flex flex-col">
      <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Clicks by Device</h3>
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display text-2xl font-extrabold text-slate-900 dark:text-slate-100">{primaryDevice.value}%</span>
          <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">{primaryDevice.name}</span>
        </div>
      </div>
      <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((device) => (
          <div key={device.name} className="text-center">
            <div className="mb-1 flex items-center justify-center gap-1 text-[10px] font-semibold uppercase text-slate-500">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: device.color }} />
              {device.name}
            </div>
            <div className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">{device.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
