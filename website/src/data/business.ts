export type BusinessAddress = { lines: string[]; visitsByAppointment: boolean; mapUrl: string };

export const businessAddress: BusinessAddress = {
  lines: ["Infinity Business Park, Block B", "4 Pieter Wenning Rd, Fourways", "Sandton, Johannesburg, 2191"],
  visitsByAppointment: false,
  mapUrl: "https://goo.gl/maps/NL44vz4LHCGbMqb78",
};
