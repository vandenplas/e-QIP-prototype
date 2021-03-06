import React from 'react'
import { i18n } from '../../../../config'
import { Field, Accordion, Svg } from '../../../Form'
import { newGuid } from '../../../Form/ValidationElement'
import Person from './Person'
import PeopleValidator, { PersonValidator } from '../../../../validators/people'
import SubsectionElement from '../../SubsectionElement'
import SummaryProgress from '../../History/SummaryProgress'
import PeopleCounter from './PeopleCounter'
import { Summary, DateSummary, NameSummary } from '../../../Summary'
import { today, daysAgo } from '../../History/dateranges'
import { InjectGaps } from '../../History/summaries'
import { Gap } from '../../History/Gap'

export default class People extends SubsectionElement {
  constructor (props) {
    super(props)

    this.update = this.update.bind(this)
    this.updateList = this.updateList.bind(this)
    this.peopleSummaryList = this.peopleSummaryList.bind(this)
    this.fillGap = this.fillGap.bind(this)
    this.inject = this.inject.bind(this)
    this.summary = this.summary.bind(this)
    this.customDetails = this.customDetails.bind(this)
  }

  update (queue) {
    this.props.onUpdate({
      List: this.props.List,
      ListBranch: this.props.ListBranch,
      ...queue
    })
  }

  updateList (values) {
    this.update({
      List: values.items,
      ListBranch: values.branch
    })
  }

  excludeGaps (items) {
    return items.filter(item => !item.type || (item.type && item.type !== 'Gap'))
  }

  sort (a, b) {
    // Helper to find the date value or default it to 0
    const getOptionalDate = (obj) => {
      return ((((obj || {}).Item || {}).Dates || {}).to || {}).date || 0
    }

    const first = getOptionalDate(a)
    const second = getOptionalDate(b)

    if (first < second) {
      return 1
    } else if (first > second) {
      return -1
    }

    return 0
  }

  fillGap (dates) {
    let items = [...this.props.List]
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

    this.update('List', this.inject(items).sort(this.sort))
  }

  summary (item, index) {
    const o = (item || {}).Item || {}
    const date = DateSummary(o.Dates)
    const name = NameSummary(o.Name)
    const type = i18n.t('relationships.people.person.collection.itemType')

    return Summary({
      type: i18n.t('relationships.people.person.collection.itemType'),
      index: index,
      left: name,
      right: date,
      placeholder: i18n.m('relationships.people.person.collection.summary.unknown')
    })
  }

  customDetails (item, index, initial, callback) {
    if (item.type === 'Gap') {
      const dates = (item.Item || {}).Dates || {}
      return (
        <Gap title={i18n.t('relationships.people.person.gap.title')}
             para={i18n.t('relationships.people.person.gap.para')}
             btnText={i18n.t('relationships.people.person.gap.button')}
             first={index === 0}
             dates={dates}
             onClick={this.fillGap.bind(this, dates)}
             />
      )
    }

    return callback()
  }

  peopleSummaryList () {
    return this.excludeGaps(this.props.List).reduce((dates, item) => {
      if (!item || !item.Item || !item.Item.Dates) {
        return dates
      }

      const knownDates = item.Item.Dates
      if (knownDates.from.date && knownDates.to.date) {
        return dates.concat(item.Item.Dates)
      }
      return dates
    }, [])
  }

  inject (items) {
    return InjectGaps(items, daysAgo(today, 365 * this.props.totalYears))
  }

  render () {
    return (
      <div className="people">
        <Field title={i18n.t('relationships.people.heading.title')}
               titleSize="h2"
               className="no-margin-bottom">
          {i18n.m('relationships.people.para.intro')}
        </Field>

        <span id="scrollToPeople"></span>
        <div className="summaryprogress progress">
          <SummaryProgress className="people-summary"
                           List={this.peopleSummaryList}
                           title={i18n.t('relationships.people.summaryProgress.title')}
                           unit={i18n.t('relationships.people.summaryProgress.unit')}
                           total={7}
                           >
            <div className="summary-icon">
              <Svg src="/img/people-who-know-you.svg" />
            </div>
          </SummaryProgress>
        </div>
        <div className="summaryprogress counter">
          <PeopleCounter List={this.props.List} />
        </div>

        <Accordion scrollTo="scrollToPeople"
                   items={this.props.List}
                   defaultState={this.props.defaultState}
                   scrollToBottom={this.props.scrollToBottom}
                   realtime={true}
                   sort={this.sort}
                   inject={this.inject}
                   branch={this.props.ListBranch}
                   summary={this.summary}
                   customDetails={this.customDetails}
                   validator={PersonValidator}
                   onUpdate={this.updateList}
                   onError={this.handleError}
                   required={this.props.required}
                   scrollIntoView={this.props.scrollIntoView}
                   description={i18n.t('relationships.people.person.collection.description')}
                   appendTitle={i18n.t('relationships.people.person.collection.appendTitle')}
                   appendLabel={i18n.t('relationships.people.person.collection.appendLabel')}>
          <Person name="Item"
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

People.defaultProps = {
  List: [],
  ListBranch: '',
  onUpdate: (queue) => {},
  onError: (value, arr) => { return arr },
  section: 'relationships',
  subsection: 'people',
  addressBooks: {},
  dispatch: () => {},
  validator: (state, props) => {
    return new PeopleValidator(props, props).isValid()
  },
  defaultState: true,
  totalYears: 7,
  scrollToBottom: ''
}
