import type { FooterMutate, FooterMutateAddressItem, FooterMutateLinksItem } from "@/api/models";
import { useState } from "react";

export interface InternalLinkItem {
  title: string;
  link: string;
}

export interface MemberBrandItem {
  name: string;
  link: string;
  logo: string;
}

export function useFooterForm(initialData?: Partial<FooterMutate>) {
  const [formData, setFormData] = useState<FooterMutate>({
    language: initialData?.language || "vi",
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
    youtube: "",
    whatsapp: "",
    zalo: "",
  });

  const [links, setLinks] = useState<FooterMutateLinksItem[]>([
    { link: "", title: "" },
  ]);

  const [internalLinks, setInternalLinks] = useState<InternalLinkItem[]>([
    { title: "", link: "" },
  ]);

  const [memberBrands, setMemberBrands] = useState<MemberBrandItem[]>([
    { name: "", link: "", logo: "" },
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

  const handleAddInternalLink = () => {
    setInternalLinks([...internalLinks, { title: "", link: "" }]);
  };

  const handleRemoveInternalLink = (index: number) => {
    setInternalLinks(internalLinks.filter((_, i) => i !== index));
  };

  const handleInternalLinkChange = (
    index: number,
    field: keyof InternalLinkItem,
    value: string,
  ) => {
    const newInternalLinks = [...internalLinks];
    newInternalLinks[index][field] = value;
    setInternalLinks(newInternalLinks);
  };

  const handleAddMemberBrand = () => {
    setMemberBrands([...memberBrands, { name: "", link: "", logo: "" }]);
  };

  const handleRemoveMemberBrand = (index: number) => {
    setMemberBrands(memberBrands.filter((_, i) => i !== index));
  };

  const handleMemberBrandChange = (
    index: number,
    field: keyof MemberBrandItem,
    value: string,
  ) => {
    const newMemberBrands = [...memberBrands];
    newMemberBrands[index][field] = value;
    setMemberBrands(newMemberBrands);
  };

  const getSubmitData = (): FooterMutate => {
    const filteredAddresses = addresses.filter(
      (addr) => addr.title?.trim() || addr.location?.trim(),
    );

    const filteredSocialLinks = Object.fromEntries(
      Object.entries(socialLinks).filter((entry) => entry[1]?.trim()),
    );

    const filteredLinks = links.filter(
      (link) => (link.title as string)?.trim() && (link.link as string)?.trim(),
    );

    const filteredInternalLinks = internalLinks.filter(
      (item) => item.title?.trim(),
    );

    const filteredMemberBrands = memberBrands.filter(
      (item) => item.name?.trim(),
    );

    return {
      ...formData,
      address: filteredAddresses,
      social_links: filteredSocialLinks,
      links: filteredLinks,
      internal_links: filteredInternalLinks as unknown as FooterMutate["internal_links"],
      member_brands: filteredMemberBrands as unknown as FooterMutate["member_brands"],
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
    internalLinks,
    setInternalLinks,
    memberBrands,
    setMemberBrands,
    handleAddAddress,
    handleRemoveAddress,
    handleAddressChange,
    handleAddLink,
    handleRemoveLink,
    handleLinkChange,
    handleAddInternalLink,
    handleRemoveInternalLink,
    handleInternalLinkChange,
    handleAddMemberBrand,
    handleRemoveMemberBrand,
    handleMemberBrandChange,
    getSubmitData,
  };
}
