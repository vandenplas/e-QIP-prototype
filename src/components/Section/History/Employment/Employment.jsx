import React from 'react'
import { i18n } from '../../../../config'
import { EmploymentValidator } from '../../../../validators'
import SubsectionElement from '../../SubsectionElement'
import { Accordion } from '../../../Form'
import { openState } from '../../../Form/Accordion/Accordion'
import { newGuid } from '../../../Form/ValidationElement'
import { today, daysAgo } from '../dateranges'
import { InjectGaps, EmploymentCustomSummary, EmploymentCaption } from '../summaries'
import EmploymentItem from './EmploymentItem'
import { Gap } from '../Gap'

const byline = (item, index, initial, translation, required, validator) => {
  switch (true) {
    // If item is required and not currently opened and is not valid, show message
    case required && !item.open && !validator(item.Item):
    case !item.open && !initial && item.Item && !validator(item.Item):
      return (<div className={`byline ${openState(item, initial)} fade in`.trim()}>
        <div className="incomplete">{i18n.m(translation)}</div>
      </div>
      )
    default:
      return null
  }
}

export default class Employment extends SubsectionElement {
  constructor (props) {
    super(props)

    this.customEmploymentByline = this.customEmploymentByline.bind(this)
    this.customEmploymentDetails = this.customEmploymentDetails.bind(this)
    this.fillGap = this.fillGap.bind(this)
    this.inject = this.inject.bind(this)
    this.updateList = this.updateList.bind(this)
  }

  customEmploymentByline (item, index, initial) {
    return byline(item, index, this.props.overrideInitial(initial), 'history.employment.default.collection.summary.incomplete', this.props.required, (item) => {
      return new EmploymentValidator(item, null).isValid()
    })
  }

  updateList (values) {
    this.props.onUpdate({
      List: values.items,
      ListBranch: values.branch
    })
  }

  fillGap (dates) {
    let items = [...this.props.value]
    items.push({
      uuid: newGuid(),
      open: true,
      Item: {
        Dates: {
          receiveProps: true,
          from: dates.from,
          to: dates.to
        }
      }
    })

    this.props.onUpdate({
      List: InjectGaps(items, daysAgo(365 * this.props.totalYears)).sort(this.sort),
      ListBranch: ''
    })
  }

  customEmploymentDetails (item, index, initial, callback) {
    if (item.type === 'Gap') {
      const dates = (item.Item || {}).Dates || {}
      return (
        <Gap title={i18n.t('history.employment.gap.title')}
             para={i18n.t('history.employment.gap.para')}
             btnText={i18n.t('history.employment.gap.btnText')}
             first={index === 0}
             dates={dates}
             onClick={this.fillGap.bind(this, dates)}
             />
      )
    }

    return callback()
  }

  inject (items) {
    return InjectGaps(items, daysAgo(today, 365 * this.props.totalYears))
  }

  render () {
    return (
      <div className="employment">
        <Accordion scrollToTop={this.props.scrollToTop}
                   defaultState={this.props.defaultState}
                   items={this.props.List}
                   branch={this.props.ListBranch}
                   sort={this.props.sort}
                   inject={this.inject}
                   realtime={this.props.realtime}
                   onUpdate={this.updateList}
                   onError={this.handleError}
                   caption={EmploymentCaption}
                   byline={this.customEmploymentByline}
                   customSummary={EmploymentCustomSummary}
                   customDetails={this.customEmploymentDetails}
                   description={i18n.t('history.employment.default.collection.summary.title')}
                   appendTitle={i18n.t('history.employment.default.collection.appendTitle')}
                   appendMessage={i18n.m('history.employment.default.collection.appendMessage')}
                   appendLabel={i18n.t('history.employment.default.collection.append')}
                   required={this.props.required}
                   scrollIntoView={this.props.scrollIntoView}>
        <EmploymentItem name="Item"
                        bind={true}
                        addressBooks={this.props.addressBooks}
                        dispatch={this.props.dispatch}
                        required={this.props.required}
                        scrollIntoView={this.props.scrollIntoView} />
        </Accordion>
      </div>
    )
  }
}

Employment.defaultProps = {
  value: [],
  List: [],
  ListBranch: '',
  scrollToTop: '',
  defaultState: true,
  realtime: false,
  sort: null,
  totalYears: 10,
  overrideInitial: (initial) => { return initial },
  onUpdate: () => {},
  onError: (value, arr) => { return arr },
  section: 'history',
  subsection: 'employment',
  addressBooks: {},
  dispatch: () => {},
  validator: (state, props) => {
    return props.List.every(x => {
      return props.ListBranch === 'No' && new EmploymentValidator(x.Item).isValid()
    })
  }
}
