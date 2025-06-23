"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _FormComponentTests = require("./FormComponent-tests");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const FormComponent = () => {
  const [formData, setFormData] = (0, _react.useState)({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    city: '',
    postalCode: ''
  });
  const [formErrors, setFormErrors] = (0, _react.useState)({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    city: '',
    postalCode: ''
  });
  const [isFormValid, setIsFormValid] = (0, _react.useState)(false);
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedFormData);
    validateField(name, value);
    validateForm(updatedFormData);
  };
  const validateField = (fieldName, value) => {
    let errorMessage = '';
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
      case 'city':
        errorMessage = (0, _FormComponentTests.validateName)(value) ? '' : 'Nom invalide';
        break;
      case 'email':
        errorMessage = (0, _FormComponentTests.validateEmail)(value) ? '' : 'Email invalide';
        break;
      case 'dateOfBirth':
        errorMessage = (0, _FormComponentTests.validateDateOfBirth)(value) ? '' : 'Doit avoir plus de 18 ans';
        break;
      case 'postalCode':
        errorMessage = (0, _FormComponentTests.validatePostalCode)(value) ? '' : 'Code postal invalide';
        break;
      default:
        break;
    }
    setFormErrors({
      ...formErrors,
      [fieldName]: errorMessage
    });
    const updatedFormData = {
      ...formData,
      [fieldName]: value
    };
    validateForm(updatedFormData);
  };
  const validateForm = updatedFormData => {
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      city,
      postalCode
    } = updatedFormData;
    const isValid = (0, _FormComponentTests.validateName)(firstName) && (0, _FormComponentTests.validateName)(lastName) && (0, _FormComponentTests.validateEmail)(email) && (0, _FormComponentTests.validateDateOfBirth)(dateOfBirth) && (0, _FormComponentTests.validateName)(city) && (0, _FormComponentTests.validatePostalCode)(postalCode);
    setIsFormValid(isValid);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (isFormValid) {
      alert('Utilisateur enregistré avec succès!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        city: '',
        postalCode: ''
      });
      setFormErrors({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        city: '',
        postalCode: ''
      });
    }
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "flex justify-center items-center min-h-screen bg-gray-100",
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)("form", {
      onSubmit: handleSubmit,
      className: "bg-white p-6 rounded-xl shadow-lg w-96",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h2", {
        className: "text-2xl font-semibold text-center mb-4",
        children: "Inscription"
      }), ['firstName', 'lastName', 'email', 'dateOfBirth', 'city', 'postalCode'].map(field => /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        className: "mb-4",
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          type: field === 'email' ? 'email' : field === 'dateOfBirth' ? 'date' : 'text',
          name: field,
          value: formData[field],
          onChange: handleInputChange,
          placeholder: field.charAt(0).toUpperCase() + field.slice(1),
          className: "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        }), formErrors[field] && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "text-red-500 text-sm",
          children: formErrors[field]
        })]
      }, field)), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        type: "submit",
        disabled: !isFormValid,
        className: `w-full p-2 text-white font-semibold rounded-lg ${isFormValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`,
        onClick: handleSubmit,
        children: "Enregistrer"
      })]
    })
  });
};
var _default = exports.default = FormComponent;