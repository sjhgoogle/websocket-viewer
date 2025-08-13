import { render } from "preact";
import "./index.css";
import {
  lazy,
  LocationProvider,
  ErrorBoundary,
  Router,
  Route,
} from "preact-iso";

// Synchronous
import { Home } from "./routers/home.jsx";
import { Demo } from "./routers/demo.jsx";
import { Describe } from "./routers/describe.jsx";

import { NotFound } from "./routers/notFound.jsx";
import { DemoBack3 } from "./routers/demoback3.jsx";
import { DemoBack2 } from "./routers/demoback2.jsx";

const App = () => (
  <LocationProvider>
    <ErrorBoundary>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/demo" component={Demo} />
        <Route path="/describe" component={Describe} />
        <Route path="/demo2" component={DemoBack2} />
        <Route path="/demo3" component={DemoBack3} />
        <Route default component={NotFound} />
      </Router>
    </ErrorBoundary>
  </LocationProvider>
);

render(<App />, document.getElementById("app"));
