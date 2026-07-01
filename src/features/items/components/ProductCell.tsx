function ProductCell(props: {
  name: string;
  image: string;
  variants?: number;
}) {
  const { image, name, variants } = props;

  return (
    <div className="flex items-center gap-3">
      <img
        src={image ?? "/placeholder.png"}
        alt={name}
        className="h-12 w-12 rounded-md border object-cover"
      />

      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        {variants && (
          <span className="text-sm text-muted-foreground">
            {variants} {variants === 1 ? "variant" : "variants"}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductCell;
