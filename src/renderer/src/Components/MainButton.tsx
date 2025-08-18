interface MainButtonProps {
  label: string;
  onClickCb?: () => void;
  variant?: "primary" | "secondary" | "danger" | "success";
}

export default function MainButton({
  label,
  onClickCb,
  variant,
}: MainButtonProps) {
  return (
    <button
      className={`rounded-md py-1.5 px-3 border border-transparent text-center text-lg text-white transition-all shadow-sm hover:shadow focus:shadow-none active:shadow-none hover:cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${
        variant === "primary"
          ? "bg-slate-800 hover:bg-slate-700"
          : variant === "secondary"
          ? "bg-slate-600 hover:bg-slate-500"
          : variant === "danger"
          ? "bg-red-600 hover:bg-red-500"
          : variant === "success"
          ? "bg-green-600 hover:bg-green-500"
          : ""
      }`}
      onClick={onClickCb}>
      {label}
    </button>
  );
}
