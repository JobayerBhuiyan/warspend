import { getTrackerData } from "@/lib/getTrackerData";
import { RealTimeProvider } from "@/components/RealTimeProvider";
import type { ClientTrackerData } from "@/components/RealTimeProvider";
import { PageContent } from "@/components/PageContent";

export const revalidate = 60;

export default async function Home() {
  const data = await getTrackerData();

  // Convert server TrackerData to client-safe shape (Date → string)
  const clientData: ClientTrackerData = {
    ...data,
    trackerConfig: {
      ...data.trackerConfig,
      startDate: data.trackerConfig.startDate.toISOString(),
    },
  };

  return (
    <RealTimeProvider initialData={clientData}>
      <PageContent />
    </RealTimeProvider>
  );
}
