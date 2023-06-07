import skaBand from "./band-json/ska-band.json";
import kpopBand from "./band-json/kpop-band.json";
import punkBand from "./band-json/punk-band.json";
import { Grid } from "@mui/material";
import { styled } from "styled-components";

import BandForm from "./BandForm";

const Page = styled(Grid)`
  width: 100vw;
  max-width: 3400px;
  margin: 0 5%;
`;

function App() {
  const bands = [skaBand, kpopBand, punkBand];
  return (
    <Page container md={12}>
      <BandForm band={bands[1]} />
    </Page>
  );
}

export default App;
