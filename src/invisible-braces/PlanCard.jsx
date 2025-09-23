import React from "react";
import './PlanCard.scss';
import CardWrapper from "../components/card-wrapper";
import DetailButton from "../components/detail-button";
import PlanCard from "../components/plan-card";
import { useLanguage } from '../context/LanguageContext';

export default function WhichPlan() {
  const { t, currentLanguage } = useLanguage();
  
  const plans = [
    {
      tag: t('invisibleBraces.planSelection.plans.mild.tag'),
      duration: t('invisibleBraces.planSelection.plans.mild.duration'),
      subtitle: t('invisibleBraces.planSelection.plans.mild.subtitle'),
      price: currentLanguage === 'en' ? null : t('invisibleBraces.planSelection.plans.mild.price'),
      badge: t('invisibleBraces.planSelection.plans.mild.badge'),
      features: t('invisibleBraces.planSelection.plans.mild.features'),
      checks: t('invisibleBraces.planSelection.plans.mild.checks'),
      color: "#48d2ce",
      complexityText: t('journey.pricingFeatures.pricingTable.mild')?.split('/')[1] || t('languages.english')
    },
    {
      tag: t('invisibleBraces.planSelection.plans.moderate.tag'),
      duration: t('invisibleBraces.planSelection.plans.moderate.duration'),
      subtitle: t('invisibleBraces.planSelection.plans.moderate.subtitle'),
      price: currentLanguage === 'en' ? null : t('invisibleBraces.planSelection.plans.moderate.price'),
      badge: t('invisibleBraces.planSelection.plans.moderate.badge'),
      features: t('invisibleBraces.planSelection.plans.moderate.features'),
      checks: t('invisibleBraces.planSelection.plans.moderate.checks'),
      color: "#48d2ce",
      complexityText: t('journey.pricingFeatures.pricingTable.moderate')?.split('/')[1] || t('languages.english')
    },
    {
      tag: t('invisibleBraces.planSelection.plans.severe.tag'),
      duration: t('invisibleBraces.planSelection.plans.severe.duration'),
      subtitle: t('invisibleBraces.planSelection.plans.severe.subtitle'),
      price: currentLanguage === 'en' ? null : t('invisibleBraces.planSelection.plans.severe.price'),
      badge: t('invisibleBraces.planSelection.plans.severe.badge'),
      features: t('invisibleBraces.planSelection.plans.severe.features'),
      checks: t('invisibleBraces.planSelection.plans.severe.checks'),
      color: "#48d2ce",
      complexityText: t('journey.pricingFeatures.pricingTable.severe')?.split('/')[1] || t('languages.english')
    }
  ];

  return (
    <CardWrapper
      title={t('invisibleBraces.planSelection.title')}
      subtitle={<>{t('invisibleBraces.planSelection.subtitle')}</>}
    >
      <div className="plan-cards">
        {plans.map((plan, idx) =>
          <PlanCard key={plan.tag} {...plan} complexityText={currentLanguage === 'en' ? t('invisibleBraces.planSelection.complexity') : '複雜程度'} />
        )}
      </div>
      <DetailButton text={t('invisibleBraces.planSelection.buttonText')}   />
    </CardWrapper>
    
  );
}
