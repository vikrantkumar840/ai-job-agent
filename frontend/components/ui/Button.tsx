import clsx from "clsx";

export default function Button({ children, onClick, variant="primary" }: any) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-6 py-3 rounded-full font-medium transition",
        variant === "primary" &&
          "bg-green-500 text-black hover:scale-105",
        variant === "ghost" &&
          "border border-white/20 text-white hover:bg-white/10"
      )}
    >
      {children}
    </button>
  );
}
