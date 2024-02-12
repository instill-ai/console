import cn from "clsx";

type ColorProps = {
  color: string;
};

const Color = ({ color }: ColorProps) => {
  return (
    <div className={cn("h-20 w-20 rounded-sm border p-2", color)} key={color}>
      <p className="text-[10px]">{color}</p>
    </div>
  );
};

export { Color };
