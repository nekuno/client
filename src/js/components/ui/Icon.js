import React, { Component } from 'react';

const Icon = ({ icon }) =>
    <span className={/^mdi-/.test(icon) ? 'mdi ' + icon : 'icon-' + icon}></span>;

export default Icon;
