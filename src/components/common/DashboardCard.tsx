import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function DashboardCard(props: { title?: string; value?: string }) {
  const { title, value } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's {title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end gap-5">
        <div className="flex flex-row items-baseline justify-between w-full gap-5 pt-6">
          {/* Added items-baseline to perfectly align the text and the graphic vertically */}
          <span className="text-3xl md:text-4xl lg:text-5xl font-bold">
            {value}
          </span>

          <div
            className="mb-1 shrink-0" // shrink-0 ensures the graphic never squishes if the number gets long
            style={{
              width: "8.5em", // Heavy-duty width to give it real presence
              height: "3.4em", // Tall enough to match the visual footprint of the big text
              backgroundImage:
                "radial-gradient(currentColor 20%, transparent 20%)",
              backgroundSize: "0.65em 0.65em", // Appropriately scaled dot sizing for a clean grid look
              backgroundPosition: "bottom left",
              clipPath:
                "polygon(0% 25%, 8% 25%, 8% 100%, 35% 100%, 35% 0%, 45% 0%, 45% 25%, 55% 25%, 55% 50%, 72% 50%, 72% 100%, 100% 100%, 100% 75%, 0% 75%)",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
