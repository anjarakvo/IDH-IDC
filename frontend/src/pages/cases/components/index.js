const commodityCategories = window.master?.commodity_categories || [];
const commodities = commodityCategories
  ? commodityCategories.reduce(
      (acc, category) => [...acc, ...category.commodities],
      []
    )
  : [];
export const commodityOptions = commodities.map((commodity) => ({
  label: commodity.name,
  value: commodity.id,
}));

export const currencyOptions = window.master?.currencies || [];
export const countryOptions = window.master?.countries || [];

export const yesNoOptions = [
  {
    label: "Yes",
    value: 1,
  },
  {
    label: "No",
    value: 0,
  },
];

export const tagOptions = [
  {
    label: "Smallholder",
    value: "smallholder",
  },
  {
    label: "Large Scale",
    value: "large-scale",
  },
  {
    label: "Plantation",
    value: "plantation",
  },
  {
    label: "Processing",
    value: "processing",
  },
  {
    label: "Trading",
    value: "trading",
  },
  {
    label: "Retail",
    value: "retail",
  },
  {
    label: "Other",
    value: "other",
  },
];

export const reportingPeriod = [
  {
    label: "Per Season",
    value: "per-season",
  },
  {
    label: "Per Year",
    value: "per-year",
  },
];

export const selectProps = {
  showSearch: true,
  allowClear: true,
  optionFilterProp: "label",
  style: {
    width: "100%",
  },
};

export const flatten = (data, parent = null) => {
  let flatData = [];
  for (const item of data) {
    const flatItem = { ...item };
    flatItem.parent_id = parent ? parent.id : null;
    flatData.push(flatItem);

    if (item.childrens && item.childrens.length > 0) {
      flatData = flatData.concat(flatten(item.childrens, item));
    }
  }
  return flatData;
};

export const indentSize = 37.5;

export const regexQuestionId = /#(\d+)/;

export const getFunctionDefaultValue = (question, prefix, values = {}) => {
  const function_name = question.default_value.split(" ");
  const getFunction = function_name.reduce((acc, fn) => {
    const questionValue = fn.match(regexQuestionId);
    if (questionValue) {
      const valueName = `${prefix}-${questionValue[1]}`;
      const value = values.find((v) => v.id === valueName)?.value;
      if (!value) {
        acc.push(0);
        return acc;
      }
      acc.push(value.toString());
    } else {
      acc.push(fn);
    }
    return acc;
  }, []);
  const finalFunction = getFunction.join("");
  return eval(finalFunction);
};

export { default as AreaUnitFields } from "./AreaUnitFields";
export { default as SideMenu } from "./SideMenu";
export { default as CaseProfile } from "./CaseProfile";
export { default as IncomeDriverDataEntry } from "./IncomeDriverDataEntry";
export { default as IncomeDriverForm } from "./IncomeDriverForm";
export { default as Questions } from "./Questions";
