import { useState } from "react";
import { Grid, Input } from "@mui/material";
import moment from "moment";
import styled from "styled-components";

type TBand = Partial<{
  name: string;
  id: string;
  date: number; // dateTime
  location: string;
  description_blurb: string;
  imgUrl: string;
  ticketTypes: TTicket[];
}>;

type TTicket = {
  type: string;
  name: string;
  description: string;
  cost: number; // cents
};

type State = Partial<{
  firstName: string;
  lastName: string;
  address: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  total: number;
  tickets: TTicket[];
}>;

const Image = styled.img`
  width: 100%;
  max-width: 600px;
`;

function BandForm({ band }: { band: TBand }) {
  const [formData, setFormData] = useState<State>({});
  const displayDate = () => {
    const date = moment(band.date);
    return date.format("dddd, MMMM D");
  };

  const handleTextChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleTicketChange = (target: EventTarget, ticket: TTicket) => {
    setFormData({
      ...formData,
      total: formData.total ? formData.total + ticket.cost : ticket.cost,
      tickets: formData.tickets ? [...formData.tickets, ticket] : [ticket],
    });
  };

  return (
    <Grid container item md={12} spacing={8}>
      <Grid container item md={12}>
        <Grid container item md={4} direction="column">
          <h1>{band.name}</h1>
          <h2>{displayDate()}</h2>
          <h2>{band.location}</h2>
        </Grid>
      </Grid>
      <Grid container item md={12} spacing={24}>
        <Grid container item md={4} direction="column">
          <Image src={band.imgUrl} alt={band.name} />
          <div
            dangerouslySetInnerHTML={{ __html: band.description_blurb ?? "" }}
          />
        </Grid>
        <Grid container item md={8} spacing={8}>
          <Grid item md={12}>
            <h2>Select Tickets</h2>
          </Grid>
          {band.ticketTypes?.map((ticket: TTicket) => (
            <Grid container item md={12} alignItems="center">
              <Grid item md={8} direction="column">
                <h3>{ticket.name}</h3>
                <p>{ticket.description}</p>
                <h3>{`$${ticket?.cost ? ticket.cost / 100 : "-"}`}</h3>
              </Grid>
              <Grid item md={4}>
                <Input
                  type="number"
                  placeholder="0"
                  onChange={({ target }) => handleTicketChange(target, ticket)}
                />
              </Grid>
            </Grid>
          ))}

          <Grid container item md={12} justifyContent="space-around">
            <Grid item md={1} justifyContent="flex-start">
              <h2>TOTAL</h2>
            </Grid>
            <Grid item md={1} justifyContent="flex-end">
              <h2>{`$${formData.total ? formData.total / 100 : "-"}`}</h2>
            </Grid>
          </Grid>
          <Grid item md={12} spacing={4}>
            <Grid
              item
              direction="row"
              justifyContent="space-between"
              alignItems="space-between"
            >
              <Input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={({ target }) =>
                  handleTextChange(target.name, target.value)
                }
              />
              <Input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={({ target }) =>
                  handleTextChange(target.name, target.value)
                }
              />
            </Grid>
            <Grid item direction="row">
              <Input
                name="address"
                type="text"
                placeholder="Address"
                onChange={({ target }) =>
                  handleTextChange(target.name, target.value)
                }
              />
            </Grid>
          </Grid>
          <Grid item md={12}>
            <strong>Payment Details</strong>
          </Grid>
          <Grid item md={12} spacing={4}>
            <Grid
              item
              direction="row"
              justifyContent="space-between"
              alignItems="space-between"
            >
              <Input
                name="cardNumber"
                type="text"
                placeholder="0000 0000 0000 0000"
                onChange={({ target }) =>
                  handleTextChange(target.name, target.value)
                }
              />
            </Grid>
            <Grid item direction="row">
              {/*should be a date picker*/}
              <Input
                name="date"
                type="text"
                placeholder="MM/YY"
                onChange={({ target }) =>
                  handleTextChange(target.name, target.value)
                }
              />
              <Input
                name="cvv"
                type="text"
                placeholder="CVV"
                onChange={({ target }) =>
                  handleTextChange(target.name, target.value)
                }
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BandForm;
