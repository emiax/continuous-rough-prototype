'use strict';
/*global CALC */

(CALC.NodeVisitor = function () {}).extend({
    visitNode: function (node) {
        throw new CALC.AbstractCallException();
    },

    visitConstant: function (node) {
        throw new CALC.AbstractCallException();
    },

    visitOperation: function (node) {
        throw new CALC.AbstractCallException();
    },

    visitUnaryOperation: function (node) {
        throw new CALC.AbstractCallException();
    },

    visitBinaryOperation: function (node) {
        throw new CALC.AbstractCallException();
    },

    visitVariable: function (node) {
        throw new CALC.AbstractCallException();
    },

    visitAddition: function (node) {
        return this.visitBinaryOperation(node);
    },

    visitSubtraction: function (node) {
        return this.visitBinaryOperation(node);
    },

    visitMultiplication: function (node) {
        return this.visitBinaryOperation(node);
    },

    visitDivision: function (node) {
        return this.visitBinaryOperation(node);
    },

    visitPower: function (node) {
        return this.visitBinaryOperation(node);
    },

    visitExp: function (node) {
        return this.visitUnaryOperation(node);
    },

    visitLn: function (node) {
        return this.visitUnaryOperation(node);
    },

    visitSin: function (node) {
        return this.visitUnaryOperation(node);
    },

    visitCos: function (node) {
        return this.visitUnaryOperation(node);
    }
});
