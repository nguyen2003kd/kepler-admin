import type { FooterMutate, FooterMutateAddressItem, FooterMutateLinksItem } from "@/api/models";
import { useState } from "react";

export function useFooterForm(initialData?: Partial<FooterMutate>) {
  const [formData, setFormData] = useState<FooterMutate>({
    description: initialData?.description || "",
    sub_description: initialData?.sub_description || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    online_visitors: initialData?.online_visitors || 0,
    total_views: initialData?.total_views || 0,
    is_active: initialData?.is_active ?? true,
  });

  const [addresses, setAddresses] = useState<FooterMutateAddressItem[]>([
    { title: "", location: "" },
  ]);

  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  const [links, setLinks] = useState<FooterMutateLinksItem[]>([
    { link: "", title: "" },
  ]);

  const handleAddAddress = () => {
    setAddresses([...addresses, { title: "", location: "" }]);
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses(addresses.filter((_addr, i) => i !== index));
  };

  const handleAddressChange = (
    index: number,
    field: keyof FooterMutateAddressItem,
    value: string,
  ) => {
    const newAddresses = [...addresses];
    newAddresses[index][field] = value;
    setAddresses(newAddresses);
  };

  const handleAddLink = () => {
    setLinks([...links, { link: "", title: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (
    index: number,
    field: keyof FooterMutateLinksItem,
    value: string,
  ) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const getSubmitData = (): FooterMutate => {
    const filteredAddresses = addresses.filter(
      (addr) => addr.title?.trim() && addr.location?.trim(),
    );

    const filteredSocialLinks = Object.fromEntries(
      Object.entries(socialLinks).filter((entry) => entry[1]?.trim()),
    );

    const filteredLinks = links.filter(
      (link) => link.title?.trim() && link.link?.trim(),
    );

    return {
      ...formData,
      address: filteredAddresses,
      social_links: filteredSocialLinks,
      links: filteredLinks,
    };
  };

  return {
    formData,
    setFormData,
    addresses,
    setAddresses,
    socialLinks,
    setSocialLinks,
    links,
    setLinks,
    handleAddAddress,
    handleRemoveAddress,
    handleAddressChange,
    handleAddLink,
    handleRemoveLink,
    handleLinkChange,
    getSubmitData,
  };
}
