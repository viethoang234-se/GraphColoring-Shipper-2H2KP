import { DEMO_ORDERS, DEPOT, DEFAULT_SHIPPERS, SMALL_ORDERS } from './data/demoOrders';
import { ShipperApp, devPipeline, type UiDataset } from './ui';

const datasets: UiDataset[] = [
  { id: 'demo-18', label: 'Demo Quận 1', orders: DEMO_ORDERS },
  { id: 'small-6', label: 'Bộ nhỏ', orders: SMALL_ORDERS },
];

// TODO (TV1, việc T18): thay devPipeline bằng pipeline thật trong src/pipeline.
function App() {
  return <ShipperApp pipeline={devPipeline} datasets={datasets} depot={DEPOT} defaultShippers={DEFAULT_SHIPPERS} />;
}

export default App;
