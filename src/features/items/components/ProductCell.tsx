function ProductCell(props: {
  name: string;
  image?: string;
  variants?: number;
}) {
  const { image, name, variants } = props;

  const initials = name
    ?.trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex items-center gap-3">
      {image ? (
        <img
          src={image}
          alt={name}
          className="h-10 w-10 shrink-0 rounded-lg border object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-primary/10 text-xs font-bold text-primary">
          {initials || "?"}
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium text-foreground">{name}</span>
        {variants !== undefined && (
          <span className="mt-0.5 w-fit text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {variants} {variants === 1 ? "variant" : "variants"}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductCell;
