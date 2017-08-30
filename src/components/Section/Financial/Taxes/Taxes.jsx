import React from 'react'
import { i18n } from '../../../../config'
import { Summary } from '../../../Summary'
import { TaxesValidator } from '../../../../validators'
import SubsectionElement from '../../SubsectionElement'
import { Branch, Show, Accordion, DateControl, Number, Field,
         Checkbox, Text, Textarea, NotApplicable, Currency } from '../../../Form'
import FailureType from './FailureType'

export default class Taxes extends SubsectionElement {
  constructor (props) {
    super(props)

    this.state = {
      HasTaxes: props.HasTaxes,
      List: props.List,
      ListBranch: props.ListBranch
    }

    this.updateBranch = this.updateBranch.bind(this)
    this.updateList = this.updateList.bind(this)
    this.summary = this.summary.bind(this)
  }

  /**
   * Updates triggered by the branching component.
   */
  updateBranch (val, event) {
    this.setState({ HasTaxes: val }, () => {
      this.updateList({
        items: val === 'Yes' ? this.state.List : [],
        branch: ''
      })
    })
  }

  /**
   * Dispatch callback initiated from the collection to notify of any new
   * updates to the items.
   */
  updateList (values) {
    this.setState({ List: values.items, ListBranch: values.branch }, () => {
      if (this.props.onUpdate) {
        this.props.onUpdate({
          List: this.state.List,
          ListBranch: this.state.ListBranch,
          HasTaxes: this.state.HasTaxes
        })
      }
    })
  }

  /**
   * Assists in rendering the summary section.
   */
  summary (item, index) {
    const obj = (item || {})
    const year = (obj.Year || {}).value || ''
    const agency = (obj.Agency || {}).value || ''

    return Summary({
      type: i18n.t('financial.taxes.collection.summary.item'),
      index: index,
      left: agency,
      right: year,
      placeholder: i18n.m('financial.taxes.collection.summary.unknown')
    })
  }

  render () {
    return (
      <div className="taxes">
        <Branch name="has_taxes"
                className="taxes-branch"
                value={this.state.HasTaxes}
                warning={true}
                onUpdate={this.updateBranch}
                required={this.props.required}
                scrollIntoView={this.props.scrollIntoView}
                onError={this.handleError}>
        </Branch>
        <Show when={this.state.HasTaxes === 'Yes'}>
          <Accordion items={this.state.List}
                     defaultState={this.props.defaultState}
                     scrollToBottom={this.props.scrollToBottom}
                     branch={this.state.ListBranch}
                     onUpdate={this.updateList}
                     onError={this.handleError}
                     summary={this.summary}
                     required={this.props.required}
                     scrollIntoView={this.props.scrollIntoView}
                     description={i18n.t('financial.taxes.collection.summary.title')}
                     appendTitle={i18n.t('financial.taxes.collection.appendTitle')}
                     appendLabel={i18n.t('financial.taxes.collection.append')}>

            <Field title={i18n.t('financial.taxes.heading.failure')}
                   adjustFor="buttons"
                   scrollIntoView={this.props.scrollIntoView}
                   shrink={true}>
              <FailureType name="Failure"
                           className="taxes-failure"
                           bind={true}
                           required={this.props.required}
                           />
            </Field>

            <Field title={i18n.t('financial.taxes.heading.year')}
              scrollIntoView={this.props.scrollIntoView}>
              <Number name="Year"
                      className="taxes-year"
                      placeholder={i18n.t('financial.taxes.placeholder.year')}
                      min="1000"
                      bind={true}
                      required={this.props.required}
                      />
              <div className="flags">
                <Checkbox name="YearEstimated"
                          ref="estimated"
                          label={i18n.t('financial.taxes.label.estimated')}
                          toggle="false"
                          bind={true}
                          />
              </div>
            </Field>

            <Field title={i18n.t('financial.taxes.heading.reason')}
              scrollIntoView={this.props.scrollIntoView}>
              <Textarea name="Reason"
                        className="taxes-reason"
                        bind={true}
                        required={this.props.required}
                        />
            </Field>

            <Field title={i18n.t('financial.taxes.heading.agency')}
              scrollIntoView={this.props.scrollIntoView}>
              <Text name="Agency"
                    className="taxes-agency"
                    bind={true}
                    required={this.props.required}
                    />
            </Field>

            <Field title={i18n.t('financial.taxes.heading.taxtype')}
              scrollIntoView={this.props.scrollIntoView}>
              <Text name="TaxType"
                    className="taxes-taxtype"
                    bind={true}
                    required={this.props.required}
                    />
            </Field>

            <Field title={i18n.t('financial.taxes.heading.amount')}
              scrollIntoView={this.props.scrollIntoView}>
              <div>
                <Currency name="Amount"
                          className="taxes-amount"
                          placeholder={i18n.t('financial.taxes.placeholder.amount')}
                          min="1"
                          bind={true}
                          required={this.props.required}
                          />
                <div className="flags">
                  <Checkbox name="AmountEstimated"
                            ref="estimated"
                            label={i18n.t('financial.taxes.label.estimated')}
                            toggle="false"
                            bind={true}
                            />
                </div>
              </div>
            </Field>

            <Field title={i18n.t('financial.taxes.heading.date')}
                   adjustFor="label"
                   scrollIntoView={this.props.scrollIntoView}
                   shrink={true}>
              <NotApplicable name="DateNotApplicable"
                             label={i18n.t('financial.taxes.label.notapplicable')}
                             or={i18n.m('financial.taxes.para.or')}
                             bind={true}>
                <DateControl name="Date"
                             className="taxes-date"
                             hideDay={true}
                             bind={true}
                             required={this.props.required}
                             />
              </NotApplicable>
            </Field>

            <Field title={i18n.t('financial.taxes.heading.description')}
              scrollIntoView={this.props.scrollIntoView}>
              <Textarea name="Description"
                        className="taxes-description"
                        bind={true}
                        required={this.props.required}
                        />
            </Field>

          </Accordion>
        </Show>
      </div>
    )
  }
}

Taxes.defaultProps = {
  HasTaxes: '',
  List: [],
  ListBranch: '',
  onError: (value, arr) => { return arr },
  section: 'financial',
  subsection: 'taxes',
  dispatch: () => {},
  validator: (state, props) => {
    return new TaxesValidator(state, props).isValid()
  },
  defaultState: true
}
