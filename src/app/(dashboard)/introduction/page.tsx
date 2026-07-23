"use client";

import { IntroductionConfig } from "../base-config/components/IntroductionConfig";
import { Header } from "@/components/layout/header";
import { useAbility } from "@/hooks/use-ability";

export default function IntroductionPage() {
  const ability = useAbility();

  const canAddSession = ability.can("add_session", "introduction");
  const canHiddenSession = ability.can("hidden_session", "introduction");
  const canDeleteSession = ability.can("delete_session", "introduction");

  return (
    <>
      <Header title="Cấu hình trang giới thiệu" />
      <IntroductionConfig
        canAddSession={canAddSession}
        canHiddenSession={canHiddenSession}
        canDeleteSession={canDeleteSession}
      />
    </>
  );
}
