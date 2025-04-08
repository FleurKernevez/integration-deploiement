"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./App.css");
var _react = _interopRequireDefault(require("react"));
var _FormComponent = _interopRequireDefault(require("./components/FormComponent/FormComponent"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function App() {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "App",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
      children: "Mon formulaire"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_FormComponent.default, {})]
  });
}
var _default = exports.default = App;