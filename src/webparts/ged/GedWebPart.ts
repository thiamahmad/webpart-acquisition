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
    <div class="card no-radius">
        <div class="card-header marge">
            <h4><i class="fa fa-file text-dark fa-lg"></i> Acquisition documents</h4>
        </div>
        <div class="card-body">
            <div class="alert alert-info" id="loading">Loading...</div>
            
            <!--div class="form-row">
                <div class="form-group col-md-12">
                    <label class="">Type d'operation</label>
                    <select class="form-control">
                        <option value="">Retrait</option>
                        <option value="">Versement</option>
                    </select>
                </div>
            </div-->

            <div class="form-row">
                <div class="form-group col-md-6">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="type-operation" id="radioRetrait" value="retrait">
                  <label class="form-check-label">Retrait</label>
                </div>
                </div>
                <div class="form-group col-md-6">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="type-operation" id="radioVersement" value="versement">
                  <label class="form-check-label">Versement</label>
                </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-md-6">
                    <label class="">Code agence</label>
                    <input type="text" class="form-control" id="codeAgence" placeholder="BI900" />
                </div>
                <div class="form-group col-md-6">
                    <label class="">Code guichet</label>
                    <input type="text" class="form-control" id="codeGuichet" placeholder="BI900" />
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-sm-6">
                    <label>Date</label>
                    <input type="date" class="form-control font-ms" id="date" />
                </div>
                <div class="form-group col-sm-6">
                    <label>Numero operation</label>
                    <input type="text" class="form-control" id="numeroOperation" />
                </div>
            </div>


            <div class="form-row" id="blocRetrait">
                <div class="form-group col-sm-12">
                    <label>Cheque ?</label>
                    <select class="form-control" name="versement">
                        <option value="AP">Au porteur</option>
                        <option value="TI">Titulaire</option>
                    </select>
                 </div>
            </div>

            <div class="form-row" id="blocVersement">
                <div class="form-group col-sm-12">
                    <label>Versement ?</label>
                    <select class="form-control" name="versement">
                        <option value="NT">Non titulaire</option>
                        <option value="TI">Titulaire</option>
                    </select>
                 </div>
            </div>

            <div class="form-row">
                <div class="form-group col-sm-12">
                    <label>Document 1</label>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="validatedCustomFile" required>
                        <label class="custom-file-label" for="validatedCustomFile">Choose file...</label>
                        <div class="invalid-feedback">Example invalid custom file feedback</div>
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-sm-12">
                    <label>Document 2</label>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="validatedCustomFile" required>
                        <label class="custom-file-label" for="validatedCustomFile">Choose file...</label>
                        <div class="invalid-feedback">Example invalid custom file feedback</div>
                    </div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group col-sm-12">
                    <label>Document 3</label>
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="validatedCustomFile" required>
                        <label class="custom-file-label" for="validatedCustomFile">Choose file...</label>
                        <div class="invalid-feedback">Example invalid custom file feedback</div>
                    </div>
                </div>
            </div>

        </div>

        <div class="card-footer text-right">
            <button class="btn btn-success" type="button" id="btnSave">Enregistrer</button>
            <button class="btn btn-danger" type="button" id="btnReset">Reset</button>
        </div>
    </div>
</div>`;

    $(document).ready(() => {
      $("#blocRetrait").hide();
      $("#blocVersement").hide();

      $("#loading").hide();

      $("#btnSave").click(() => {
        let select = $("select[name='type']").val();
        $("#loading").text(select).show();
      });

      $("input[type='radio'][name='type-operation']").change(() => {
        let type = $("input[type='radio'][name='type-operation']:checked").val();
        if (type === 'versement') {
          $("#blocRetrait").hide();
          $("#blocVersement").show();
        } else {
          $("#blocRetrait").show();
          $("#blocVersement").hide();
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
