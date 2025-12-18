import { Header } from "@/components/layout/Header";

export default function Analytics() {
  const dashboards = [
    {
      title: "Overview Dashboard",
      src: "http://localhost:5601/app/dashboards#/view/271c836c-29bb-4108-b51e-2009363faa2d?embed=true&_g=%28%29"
    },
    {
      title: "Temporal Analysis",
      src: "http://localhost:5601/app/dashboards#/view/56477142-9f9b-43ca-805e-fc964d55cc4a?embed=true&_g=%28refreshInterval%3A%28pause%3A%21t%2Cvalue%3A60000%29%2Ctime%3A%28from%3A%271987-03-10T07%3A49%3A19.946Z%27%2Cto%3A%271987-09-01T12%3A22%3A15.659Z%27%29%29"
    },
    {
      title: "Geographic Analysis",
      src: "http://localhost:5601/app/dashboards#/view/a8b28ffb-fb41-4880-a8cb-68438f8c0db3?embed=true&_g=%28refreshInterval%3A%28pause%3A%21t%2Cvalue%3A60000%29%2Ctime%3A%28from%3A%271987-03-10T07%3A49%3A19.946Z%27%2Cto%3A%271987-09-01T12%3A22%3A15.659Z%27%29%29"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Index Analytics</h1>
          <p className="text-muted-foreground">
            Explore the distribution and characteristics of the Reuters news archive
          </p>
        </div>

        <div className="space-y-6">
          {dashboards.map((dashboard, index) => (
            <div key={index} className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <h2 className="text-lg font-semibold text-foreground">{dashboard.title}</h2>
              </div>
              <iframe
                src={dashboard.src}
                className="w-full border-0"
                height="600"
                title={dashboard.title}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
