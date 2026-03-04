sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageBox) => {
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

        onSave: function (params) {
            var oModel = this.getView().getModel("formModel");
            var oFormData = oModel.getProperty("/formData");

            var aRequiredFields = ["Ad", "Soyad", "Telefon"];
            var aMissingFields = [];

            aRequiredFields.forEach(function (sField) {
                var sValue = oFormData[sField];
                if (!sValue || sValue.trim() === "") {
                    aMissingFields.push(sField);
                }
            });

            if (aMissingFields.length > 0) {
                MessageBox.error("Lütfen tüm zorunlu alanları doldurunuz!");
                return;
            }

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
        },
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
        },
        onTableSelectionChange: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("listItem");    
          var oSelectedData = oSelectedItem.getBindingContext("formModel").getObject();    
          console.log("Seçilen Personel:", oSelectedData.Ad);  
       },
       onDelete: function () {
            var oTable = this.byId("tblIzin");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                sap.m.MessageToast.show("Lütfen silmek istediğiniz satırı seçiniz.");
                return;
            }

            //  /PersonelIzinListesi/2
            var sPath = oSelectedItem.getBindingContextPath();
            var iIndex = parseInt(sPath.substring(sPath.lastIndexOf("/") + 1));

            // 3. Modeli ve diziyi alalım
            var oModel = this.getView().getModel("formModel");
            var aList = oModel.getProperty("/PersonelIzinListesi");

            var sAdSoyad = aList[iIndex].Ad + " " + aList[iIndex].Soyad;
            aList.splice(iIndex, 1);

            oModel.setProperty("/PersonelIzinListesi", aList);
            oTable.removeSelections();
        }
    });
});