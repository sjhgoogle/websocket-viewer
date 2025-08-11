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

const App = () => (
  <LocationProvider>
    <ErrorBoundary>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/demo" component={Demo} />
        <Route path="/describe" component={Describe} />
        <Route default component={NotFound} />
      </Router>
    </ErrorBoundary>
  </LocationProvider>
);

render(<App />, document.getElementById("app"));
