import React from "react";

const Field = ({
  field,
  prompt,
  description,
  optional,
  perRow,
  fixedWidth,
  readonly,
  disabled,
  densePadding,
  nullSwitch,
  options,
  Component,
  value,
  onChange,
  errors,
}) => {
  return React.useMemo(
    () => (
      <FormField fixedWidth={fixedWidth} perRow={perRow}>
        {prompt && (
          <FieldHeader itemSpacing="xsmall">
            <span>{prompt}</span>
            {optional && !readonly && (
              <FieldOptionalLabel>(optional)</FieldOptionalLabel>
            )}
            {nullSwitch && (
              <InlineSwitch
                checked={value !== null}
                onChange={(e) =>
                  onChange({
                    field,
                    value: e.target.checked ? undefined : null,
                  })
                }
              />
            )}
          </FieldHeader>
        )}
        {prompt && <Spacer small />}
        {description && <FieldDescription>{description}</FieldDescription>}
        {description && <Spacer small />}
        {(nullSwitch ? value !== null : true) && Component && (
          <Component
            field={field}
            isNested
            optional={optional}
            readonly={readonly}
            disabled={disabled}
            densePadding={densePadding}
            {...options}
            value={value}
            onChange={onChange}
            errors={errors}
          />
        )}
      </FormField>
    ),
    [
      Component,
      densePadding,
      disabled,
      errors,
      field,
      fixedWidth,
      onChange,
      optional,
      nullSwitch,
      options,
      perRow,
      prompt,
      description,
      readonly,
      value,
    ]
  );
};
const Form = ({
  fields,
  schema,
  value,
  onChange,
  errors = noOptions,
  isNested = false,
  readonly: formReadonly = false,
  hideReadonlyEmpty = false,
  disabled: formDisabled = false,
  densePadding: formDensePadding = false,
  className = undefined,
}) => {
  const curVal = React.useRef(value);
  const curErr = React.useRef(errors);
  React.useEffect(() => {
    curVal.current = value;
  }, [curVal, value]);
  React.useEffect(() => {
    curErr.current = errors;
  }, [curErr, errors]);

  const fieldOnChange = React.useMemo(
    () =>
      ({ field, value: fieldValue, errors: fieldErrors }) => {
        /* TODO: This is a workaround for some field onChange events sending a
      DOM event rather than a short term value. This sort of inconsistency
      will be fixed after migrating all input controls to newer implementations,
      such as the case with the newer <Input /> utility component`
    */
        const parsedValue = fieldValue?.target
          ? fieldValue.target.value
          : fieldValue;

        return onChange({
          value: deepSet(curVal.current, field, parsedValue),
          errors: deepSet(curErr.current, field, fieldErrors),
          field,
        });
      },
    [onChange]
  );

  const buildField = (field) => {
    const {
      prompt,
      description,
      type,
      optional,
      perRow,
      fixedWidth,
      readonly: fieldReadonly,
      disabled: fieldDisabled,
      options = noOptions,
      nullSwitch,
    } = fields[field];
    const Component = typeof type === "string" ? TYPE_TO_COMPONENT[type] : type;
    const fieldValue = value[field];
    const fieldErrors = errors[field];
    const props = {
      field,
      prompt,
      description,
      optional,
      perRow,
      fixedWidth,
      readonly: formReadonly || fieldReadonly,
      disabled: formDisabled || fieldDisabled,
      densePadding: formDensePadding || (formReadonly && !isNested),
      nullSwitch,
      options,
      Component,
      value: fieldValue,
      onChange: fieldOnChange,
      errors: fieldErrors,
    };

    return hideReadonlyEmpty && props.readonly && isEmpty(fieldValue) ? null : (
      <Field key={field} {...props} />
    );
  };

  const getSchemaFieldType = (schemaField) =>
    typeof schemaField === "string" || typeof schemaField === "number"
      ? "field"
      : isPlainObject(schemaField)
      ? schemaField.type
      : "";

  const getKeyForNestedSchema = (nestedSchema) =>
    nestedSchema.schema
      .map((schemaRow) => getKeyForRowDef(schemaRow))
      .join("|");

  const getKeyForRowDef = (rowDef) =>
    rowDef.fields
      .map((field) => {
        switch (getSchemaFieldType(field)) {
          case "field":
            return field;
          case "nested":
            return getKeyForNestedSchema(field);
          case "none":
          case "display":
            return field.key;
          default:
            return "";
        }
      })
      .join("|") + "row";

  const mapSchemaField = (schemaField) => {
    switch (getSchemaFieldType(schemaField)) {
      case "field":
        return buildField(schemaField);
      case "nested":
        return (
          <NestedSchema
            fixedWidth={schemaField.fixedWidth}
            perRow={schemaField.perRow}
            key={getKeyForNestedSchema(schemaField)}
          >
            {schemaField.prompt && (
              <FieldHeader itemSpacing="xsmall">
                <span>{schemaField.prompt}</span>
                {schemaField.optional && !schemaField.readonly && (
                  <FieldOptionalLabel>(optional)</FieldOptionalLabel>
                )}
              </FieldHeader>
            )}
            {schemaField.prompt && <Spacer small />}
            {schemaField.description && (
              <FieldDescription>{schemaField.description}</FieldDescription>
            )}
            {schemaField.description && <Spacer small />}
            {buildSchema(schemaField.schema)}
          </NestedSchema>
        );
      case "none":
      case "display":
        const { key, text, type, perRow, ...fieldDef } = schemaField;
        return (
          <Field
            key={schemaField.text || schemaField.key}
            Component={TYPE_TO_COMPONENT[type]}
            perRow={perRow || "auto"}
            {...fieldDef}
          />
        );

      default:
        return null;
    }
  };

  const buildSchema = (schema) => {
    const buildRow = (rowDef) => {
      const {
        key = getKeyForRowDef(rowDef),
        header,
        headerSpacing = "medium",
        fields: s_fields,
        spacing = "larger",
        itemSpacing = "smallish",
        maxWidth,
        combined,
      } = rowDef;

      const rendered = s_fields.map(mapSchemaField);
      const allNull = isEmpty(
        rendered.filter((renderedField) => renderedField ?? undefined)
      );

      return hideReadonlyEmpty && allNull ? null : (
        <Column style={{ maxWidth }} key={key}>
          {header && <FormHeading>{header}</FormHeading>}
          {header && <Spacer {...{ [headerSpacing]: true }} />}
          <FieldsRow
            itemSpacing={itemSpacing}
            paddingSpacing
            combined={combined}
          >
            {rendered}
          </FieldsRow>
          {spacing && <Spacer {...{ [spacing]: true }} />}
        </Column>
      );
    };

    const rowList = schema.map(buildRow);
    if (hideReadonlyEmpty && formReadonly) {
      const lastRowIdx = rowList.reduceRight((lastRowIdx, curRow, i) => {
        if (lastRowIdx !== undefined) return lastRowIdx;
        if (curRow) return i;
        return lastRowIdx;
      }, undefined);
      if (lastRowIdx !== undefined) {
        rowList[lastRowIdx] = buildRow({
          ...schema[lastRowIdx],
          spacing: false,
        });
      }
    }

    return rowList;
  };

  const FormOrDiv = isNested ? "form" : "div";
  const builtSchema = buildSchema(schema);
  if (
    hideReadonlyEmpty &&
    isEmpty(builtSchema.filter((renderedField) => renderedField ?? undefined))
  )
    return null;
  return <FormOrDiv className={className}>{builtSchema}</FormOrDiv>;
};

// Helper to copy and set a deep value given an object path like: 'social.facebook'
const deepSet = (obj, path, value) => {
  const objCopy = { ...obj };

  const pathPieces = ("" + path).split(".");
  const lastKey = pathPieces[pathPieces.length - 1];
  const beforeLast = pathPieces[pathPieces.length - 2];

  pathPieces.reduce((newObj, key) => {
    // duplicate the parent of the object/key to set
    if (key === beforeLast) {
      newObj[key] = { ...newObj[key] };
    }

    // set the value
    return key === lastKey ? (newObj[key] = value) : newObj[key];
  }, objCopy);

  return objCopy;
};

export default Form;
