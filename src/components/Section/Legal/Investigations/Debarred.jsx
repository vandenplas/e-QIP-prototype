import React from 'react'
import { i18n } from '../../../../config'
import SubsectionElement from '../../SubsectionElement'
import { LegalInvestigationsDebarredValidator, DebarredValidator } from '../../../../validators'
import { Summary, DateSummary } from '../../../Summary'
import { Accordion, Branch, Show } from '../../../Form'
import DebarredItem from './DebarredItem'

export default class Debarred extends SubsectionElement {
  constructor (props) {
    super(props)

    this.update = this.update.bind(this)
    this.updateBranch = this.updateBranch.bind(this)
    this.updateList = this.updateList.bind(this)
  }

  update (queue) {
    this.props.onUpdate({
      List: this.props.List,
      ListBranch: this.props.ListBranch,
      HasDebarment: this.props.HasDebarment,
      ...queue
    })
  }

  updateList (values) {
    this.update({
      List: values.items,
      ListBranch: values.branch
    })
  }

  updateBranch (values) {
    this.update({
      HasDebarment: values,
      List: values === 'Yes' ? this.props.List : [],
      ListBranch: values === 'Yes' ? this.props.ListBranch : ''
    })
  }

  summary (item, index) {
    const o = ((item && item.Item) || {})
    const dates = DateSummary(o.Date)
    const agency = (o.Agency || {}).value || ''

    return Summary({
      type: i18n.t('legal.investigations.debarred.collection.item'),
      index: index,
      left: agency,
      right: dates,
      placeholder: i18n.m('legal.investigations.debarred.collection.unknown')
    })
  }

  render () {
    return (
      <div className="investigations-debarred">
        <Branch name="has_debarred"
                label={i18n.t('legal.investigations.debarred.heading.title')}
                labelSize="h2"
                className="legal-investigations-debarred-has-debarment"
                value={this.props.HasDebarment}
                warning={true}
                onError={this.handleError}
                required={this.props.required}
                onUpdate={this.updateBranch}
                scrollIntoView={this.props.scrollIntoView}>
        </Branch>

        <Show when={this.props.HasDebarment === 'Yes'}>
          <Accordion defaultState={this.props.defaultState}
                     items={this.props.List}
                     scrollToBottom={this.props.scrollToBottom}
                     branch={this.props.ListBranch}
                     summary={this.summary}
                     onUpdate={this.updateList}
                     onError={this.handleError}
                     validator={DebarredValidator}
                     description={i18n.t('legal.investigations.debarred.collection.description')}
                     appendTitle={i18n.t('legal.investigations.debarred.collection.appendTitle')}
                     appendLabel={i18n.t('legal.investigations.debarred.collection.appendLabel')}
                     required={this.props.required}
                     scrollIntoView={this.props.scrollIntoView}>
                     <DebarredItem name="Item"
                       bind={true}
                       required={this.props.required}
                       scrollIntoView={this.props.scrollIntoView}
                     />
          </Accordion>
        </Show>
      </div>
    )
  }
}

Debarred.defaultProps = {
  name: 'debarred',
  HasDebarment: '',
  List: [],
  ListBranch: '',
  defaultState: true,
  onUpdate: (queue) => {},
  onError: (value, arr) => { return arr },
  section: 'legal',
  subsection: 'investigations/debarred',
  dispatch: () => {},
  validator: (state, props) => {
    return new LegalInvestigationsDebarredValidator(props).isValid()
  },
  scrollToBottom: ''
}
