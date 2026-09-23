export * from "./types";
export * from "./valuation-spec";
export * from "./cipc-spec";
export * from "./tax-spec";
export * from "./financial-statements-spec";

import { ServiceDeliverySpec } from "./types";
import { VALUATION_DELIVERY_SPEC } from "./valuation-spec";
import { CIPC_DELIVERY_SPEC } from "./cipc-spec";
import { TAX_DELIVERY_SPEC } from "./tax-spec";
import { AFS_DELIVERY_SPEC } from "./financial-statements-spec";

export const SERVICE_DELIVERY_REGISTRY: Record<string, ServiceDeliverySpec> = {
  // Flagship Business Valuations
  valuation_comprehensive: VALUATION_DELIVERY_SPEC,
  valuation_express: {
    ...VALUATION_DELIVERY_SPEC,
    serviceId: "valuation_express",
    serviceName: "Express Business Valuation Diagnostic & Multiples",
    typicalTurnaroundDays: 5,
    summary:
      "High-level indicative valuation diagnostic analyzing historical earnings, maintainable EBITDA, and industry multiple benchmarks for quick strategic decision-making.",
  },

  // CIPC Statutory Compliance
  cipc_annual_return: CIPC_DELIVERY_SPEC,
  cipc_beneficial_ownership: {
    ...CIPC_DELIVERY_SPEC,
    serviceId: "cipc_beneficial_ownership",
    serviceName: "Beneficial Ownership (BO) Register Lodgement & Verification",
    summary:
      "Standalone Beneficial Ownership compliance update with look-through register construction and CIPC lodgement under General Laws Amendment Act 2022.",
  },

  // SARS & Taxation
  tax_clearance: TAX_DELIVERY_SPEC,
  tax_vat_reg: {
    ...TAX_DELIVERY_SPEC,
    serviceId: "tax_vat_reg",
    serviceName: "SARS VAT Registration (Voluntary / Compulsory)",
    summary:
      "End-to-end VAT registration with SARS, proof of commercial turnover verification, bank detail verification, and VAT201 filing activation.",
    typicalTurnaroundDays: 5,
  },

  // Accounting & AFS Compilation
  afs_company: AFS_DELIVERY_SPEC,
  afs_cc: {
    ...AFS_DELIVERY_SPEC,
    serviceId: "afs_cc",
    serviceName: "Close Corporation (CC) Annual Financial Statements",
    summary:
      "Statutory AFS compilation and Accounting Officer report for Close Corporations under the Close Corporations Act 69 of 1984.",
  },
  afs_trust: {
    ...AFS_DELIVERY_SPEC,
    serviceId: "afs_trust",
    serviceName: "Trust Annual Financial Statements & Master's Compliance",
    summary:
      "Trust accounting, beneficiary loan account reconciliation, and Master of the High Court annual compliance.",
  },
};

/**
 * Retrieve the detailed end-to-end delivery specification for any service
 */
export function getServiceDeliverySpec(serviceId: string): ServiceDeliverySpec | undefined {
  return SERVICE_DELIVERY_REGISTRY[serviceId];
}

/**
 * Get all available service delivery specifications
 */
export function listServiceDeliverySpecs(): ServiceDeliverySpec[] {
  return Object.values(SERVICE_DELIVERY_REGISTRY);
}

/**
 * Filter delivery specifications by business category
 */
export function getServiceDeliveryByCategory(
  category: ServiceDeliverySpec["category"]
): ServiceDeliverySpec[] {
  return Object.values(SERVICE_DELIVERY_REGISTRY).filter((spec) => spec.category === category);
}
