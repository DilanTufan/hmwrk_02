sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("com.dilan.hmwrk02.controller.Main", {
        onInit() {
            var oData = {
                formData: {
                    Ad: "",
                    Soyad: "",
                    Telefon: "",
                    IzinTuruKey: "",
                    IzinTuruMetni: "",
                    GidecegiYer: { Ulke: "", Sehir: "" },
                    Adres: "",
                    EhliyetVarMi: true,
                    EhliyetDurumu: "",
                    EhliyetDurumuMetni: ""
                },
                IzinTurleri: [
                    { key: "YILLIK", text: "Yıllık İzin" },
                    { key: "MAZERET", text: "Mazeret İzni" },
                    { key: "SAGLIK", text: "Sağlık Raporu" },
                    { key: "UCRETSIZ", text: "Ücretsiz İzin" }
                ],
                EhliyetTipleri: [
                    { key: "A", text: "A Sınıfı (Motosiklet)" },
                    { key: "B", text: "B Sınıfı (Otomobil)" },
                    { key: "E", text: "E Sınıfı (Ağır Vasıta)" }
                ],
                PersonelIzinListesi: []
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "formModel");
        },
        onSave : function (params) {
            var oModel = this.getView().getModel("formModel");
            var oNewEntry = Object.assign({}, oModel.getProperty("/formData"));

            var oSelect = this.getView().byId("idIzinTuru");
            if (oSelect) {
                oNewEntry.IzinTuruMetni = oSelect.getSelectedItem().getText();
            }

            if (oNewEntry.EhliyetVarMi) {
                var oEhliyetSelect = this.getView().byId("idEhliyetSelect");
                if (oEhliyetSelect && oEhliyetSelect.getSelectedItem()) {
                    oNewEntry.EhliyetDurumuMetni = oEhliyetSelect.getSelectedItem().getText();
                }
            } else {
                oNewEntry.EhliyetDurumuMetni = "Yok";
            }
         
            var aList = oModel.getProperty("/PersonelIzinListesi");
            aList.push(oNewEntry);
            oModel.setProperty("/PersonelIzinListesi", aList);
            this._resetForm();
        } ,
        _resetForm: function () {
            var oModel = this.getView().getModel("formModel");
            oModel.setProperty("/formData", {
                Ad: "",
                Soyad: "",
                Telefon: "",
                IzinTuruKey: "",
                GidecegiYer: { Ulke: "", Sehir: "" },
                Adres: "",
                EhliyetVarMi: true,
                EhliyetDurumu: ""
            });
        }
    });
});