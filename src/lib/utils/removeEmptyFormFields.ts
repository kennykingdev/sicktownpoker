interface DataObject {
  [index: string]: any;
}

const removeEmptyFormFields = (data: DataObject) => {
  Object.keys(data).forEach((key) => {
    if (data[key] === '' || data[key] == null) {
      delete data[key];
    }
  });
};

export default removeEmptyFormFields;
