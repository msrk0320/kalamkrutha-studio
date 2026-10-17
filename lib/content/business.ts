function optionalUrl(value: string | undefined): string | undefined {
  return value && /^https:\/\//.test(value) ? value : undefined;
}

export const business = {
  name: "Kalamkrutha Digital Studio",
  phoneDisplay: "+91 88858 58111",
  phoneE164: "+918885858111",
  whatsapp: "918885858111",
  email: "kalamkrutha@gmail.com",
  address: {
    street: "Opp Bharath Gas, 3/1 Line, Sitaram Nagar-Old",
    locality: "Guntur",
    region: "Andhra Pradesh",
    postalCode: "522001",
    country: "IN",
  },
  hours: {
    opens: "09:00",
    closes: "21:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  foundingYear: 2016,
  payments: ["UPI", "Paytm"],
  social: {
    instagram: optionalUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    facebook: optionalUrl(process.env.NEXT_PUBLIC_FACEBOOK_URL),
    youtube: optionalUrl(process.env.NEXT_PUBLIC_YOUTUBE_URL),
  },
} as const;

export const fullAddress = [
  business.address.street,
  `${business.address.locality} ${business.address.postalCode}`,
  business.address.region,
].join(", ");
