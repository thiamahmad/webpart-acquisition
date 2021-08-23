import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './GedWebPart.module.scss';
import * as strings from 'GedWebPartStrings';


import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';

require('../../../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../../../node_modules/@fortawesome/fontawesome-free/css/all.min.css');

require('./perso.css')

export interface IGedWebPartProps {
  description: string;
}

export default class GedWebPart extends BaseClientSideWebPart<IGedWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
    <div class="container">
    <div class="card no-radius ">
        <div class="card-header card-success marge">
            <h4>ACQUISITION</h4>
        </div>
        <div class="card-body">

            <div class="alert alert-info" id="loading">Loading...</div>
            
            <div class="form-row">
                <div class="form-group col-md-10 offset-4">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="type-operation" id="radioRetrait" value="retrait">
                    <label class="form-check-label">Retrait</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="type-operation" id="radioVersement" value="versement">
                    <label class="form-check-label">Versement</label>
                  </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-md-3">
                    <label class="">Code agence</label>
                    <input type="text" class="form-control" id="codeAgence" placeholder="BI900" />
                </div>
                <div class="form-group col-md-3">
                    <label class="">Code guichet</label>
                    <input type="text" class="form-control" id="codeGuichet" placeholder="BI900" />
                </div>
                <div class="form-group col-sm-6">
                    <label>Date</label>
                    <input type="date" class="form-control font-ms" id="date" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-sm-6">
                    <label>Numero opération</label>
                    <input type="text" class="form-control" id="numeroOperation" value=""  />
                </div>
                <div class="form-group col-sm-6">
                    <label>Numéro client</label>
                    <input type="text" class="form-control" id="numeroClient" value=""  />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-md-6">
                    <label class="">Montant</label>
                    <input type="number" min="100000" class="form-control" id="montant" name="montant"  />
                </div>
                <div class="form-group col-sm-6">
                    <label>Référence du chèque</label>
                    <input type="numeric" class="form-control" id="referenceCheque" value=""  />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-sm-12">
                    <label>Bénéficiaire / Remettant</label>
                    <input type="text" class="form-control" id="beneficiaire" value=""  />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-sm-12">
                    <label>Motif de la demande</label>
                    <textarea class="form-control" id="motif" ></textarea>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-sm-12">
                    <label>Envoyé à</label>
                    <input type="text" class="form-control" id="mailReception" value=""  />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-md-10 offset-3">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="type-client" id="radioPorteur" value="porteur">
                    <label class="form-check-label">Chèque au porteur</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="type-client" id="radioTitulaire" value="titulaire">
                    <label class="form-check-label">Titulaire du compte</label>
                  </div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="col-md-6 text-right">
                  <label>Particularite du compte ?</label>
                </div>
                <div class="form-group col-md-6">
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="particularite" id="particulariteOui" value="Oui">
                    <label class="form-check-label">Oui</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="particularite" id="particulariteNon" value="Non">
                    <label class="form-check-label">Non</label>
                  </div>
                </div>
            </div>

            <div class="form-row" id="blocFA">
                <div class="form-group col-sm-12">
                    <label>Fiche d'accrochage</label>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="ficheAccrochage" />
                        <label class="custom-file-label" for="ficheAccrochage">Choisir un fichier...</label>
                    </div>
                </div>
            </div>

            <div class="form-row" id="blocFR">
              <div class="form-group col-sm-6 offset-4">
                <a class="btn btn-outline-danger" id="btnFillRegistre">Remplir la fiche de registre</a>
              </div>
            </div>

            <div class="form-row" id="blocCI">
              <div class="form-group col-sm-12">
                  <label>Pièce d'identité</label>
                  <div class="custom-file">
                      <input type="file" class="custom-file-input" id="pieceIdentite" required>
                      <label class="custom-file-label" for="pieceIdentite">Choisir un fichier...</label>
                  </div>
              </div>
            </div>

            <div class="form-row" id="blocCQ">
              <div class="form-group col-sm-12">
                  <label>Chèque</label>
                  <div class="custom-file">
                      <input type="file" class="custom-file-input" id="cheque" required>
                      <label class="custom-file-label" for="cheque">Choisir un fichier...</label>
                  </div>
              </div>
            </div>

        </div>

        <div class="card-footer text-right">
            <button class="btn btn-danger" type="button" id="btnAsk4Val">Demande de validation</button>
            <button class="btn btn-success" type="button" id="btnValidate">Validation</button>
            <button class="btn btn-outline-secondary" type="button" id="btnReset">Reset</button>
        </div>
    </div>
</div>`;

    $(document).ready(() => {
      $("#blocFA").hide();
      $("#blocCI").hide();
      $("#blocCQ").hide();
      $("#blocFR").hide();

      $("#loading").hide();

      // - Gestion bouton validation -  demande validation
      $("input[type='number'][name='montant']").blur(() => {
        let montant = $("input[type='number'][name='montant']").val();
        alert(montant);
        if (montant >= 800000) {
          $("#btnValidate").hide();
        }
        if (montant >= 5000000) {
          $("#blocFR").show();
        }
      });

      // - si particularites, alors FA
      $("input[type='radio'][name='particularite']").change(() => {
        let part = $("input[type='radio'][name='particularite']:checked").val();
        if (part === 'Oui') {
          $("#blocFA").show();
        } else {
          $("#blocFA").hide();
        }
      });

      // - Cheque pour retrait
      $("input[type='radio'][name='type-operation']").change(() => {
        let part = $("input[type='radio'][name='type-operation']:checked").val();
        if (part === 'retrait') {
          $("#blocCQ").show();
        } else {
          $("#blocCA").hide();
        }
      });

      // - CNI pour au porteur
      $("input[type='radio'][name='type-client']").change(() => {
        let part = $("input[type='radio'][name='type-client']:checked").val();
        if (part === 'porteur') {
          $("#blocCI").show();
        } else {
          $("#blocCI").hide();
        }
      });

      $("#btnReset").click(() => {
        $("#loading").empty().hide();
      });

    });
  }

  private setText(): void {
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
