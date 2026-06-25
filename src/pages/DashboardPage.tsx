import DashboardCard from "@/components/common/DashboardCard";

function DashboardPage() {

  return (
    <div className="p-6 space-y-6">
      {/* DashboardPage
      <input type="button" value="click" onClick={getUser} /> */}
      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
      <DashboardCard title="Orders" value="20" />
      <DashboardCard title="Customers" value="15" />
      <DashboardCard title="Items" value="30" />
      <DashboardCard title="Vendors" value="5" />
      </section>
      <section>
        HEHEHEHEHEHEHE
      </section>
    </div>
  );
}

export default DashboardPage;
