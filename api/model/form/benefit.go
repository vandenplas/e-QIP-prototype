package form

import (
	"encoding/json"

	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
)

type Benefit struct {
	PayloadBegin                Payload `json:"Begin,omitempty" sql:"-"`
	PayloadEnd                  Payload `json:"End,omitempty" sql:"-"`
	PayloadFrequency            Payload `json:"Frequency,omitempty" sql:"-"`
	PayloadOtherFrequency       Payload `json:"OtherFrequency,omitempty" sql:"-"`
	PayloadReceived             Payload `json:"Received,omitempty" sql:"-"`
	PayloadCountry              Payload `json:"Country" sql:"-"`
	PayloadValue                Payload `json:"Value" sql:"-"`
	PayloadValueEstimated       Payload `json:"ValueEstimated" sql:"-"`
	PayloadReason               Payload `json:"Reason" sql:"-"`
	PayloadObligated            Payload `json:"Obligated" sql:"-"`
	PayloadObligatedExplanation Payload `json:"ObligatedExplanation" sql:"-"`

	// Validator specific fields
	Begin                *DateControl `json:"-"`
	End                  *DateControl `json:"-"`
	Frequency            *Radio       `json:"-"`
	OtherFrequency       *Textarea    `json:"-"`
	Received             *DateControl `json:"-"`
	Country              *Country     `json:"-"`
	Value                *Number      `json:"-"`
	ValueEstimated       *Checkbox    `json:"-"`
	Reason               *Textarea    `json:"-"`
	Obligated            *Branch      `json:"-"`
	ObligatedExplanation *Textarea    `json:"-"`

	// Persister specific fields
	ID                     int
	AccountID              int64
	BeginID                int
	EndID                  int
	FrequencyID            int
	OtherFrequencyID       int
	ReceivedID             int
	CountryID              int
	ValueID                int
	ValueEstimatedID       int
	ReasonID               int
	ObligatedID            int
	ObligatedExplanationID int
}

// Unmarshal bytes in to the entity properties.
func (entity *Benefit) Unmarshal(raw []byte) error {
	err := json.Unmarshal(raw, entity)
	if err != nil {
		return err
	}

	if entity.PayloadBegin.Type != "" {
		begin, err := entity.PayloadBegin.Entity()
		if err != nil {
			return err
		}
		entity.Begin = begin.(*DateControl)
	}

	if entity.PayloadEnd.Type != "" {
		end, err := entity.PayloadEnd.Entity()
		if err != nil {
			return err
		}
		entity.End = end.(*DateControl)
	}

	if entity.PayloadFrequency.Type != "" {
		frequency, err := entity.PayloadFrequency.Entity()
		if err != nil {
			return err
		}
		entity.Frequency = frequency.(*Radio)
	}

	if entity.PayloadOtherFrequency.Type != "" {
		otherFrequency, err := entity.PayloadOtherFrequency.Entity()
		if err != nil {
			return err
		}
		entity.OtherFrequency = otherFrequency.(*Textarea)
	}

	if entity.PayloadReceived.Type != "" {
		received, err := entity.PayloadReceived.Entity()
		if err != nil {
			return err
		}
		entity.Received = received.(*DateControl)
	}

	country, err := entity.PayloadCountry.Entity()
	if err != nil {
		return err
	}
	entity.Country = country.(*Country)

	value, err := entity.PayloadValue.Entity()
	if err != nil {
		return err
	}
	entity.Value = value.(*Number)

	valueEstimated, err := entity.PayloadValueEstimated.Entity()
	if err != nil {
		return err
	}
	entity.ValueEstimated = valueEstimated.(*Checkbox)

	reason, err := entity.PayloadReason.Entity()
	if err != nil {
		return err
	}
	entity.Reason = reason.(*Textarea)

	obligated, err := entity.PayloadObligated.Entity()
	if err != nil {
		return err
	}
	entity.Obligated = obligated.(*Branch)

	obligatedExplanation, err := entity.PayloadObligatedExplanation.Entity()
	if err != nil {
		return err
	}
	entity.ObligatedExplanation = obligatedExplanation.(*Textarea)

	return err
}

// Valid checks the value(s) against an battery of tests.
func (entity *Benefit) Valid() (bool, error) {
	if ok, err := entity.Country.Valid(); !ok {
		return false, err
	}

	if ok, err := entity.Value.Valid(); !ok {
		return false, err
	}

	if ok, err := entity.Reason.Valid(); !ok {
		return false, err
	}

	if ok, err := entity.Obligated.Valid(); !ok {
		return false, err
	}

	if entity.Obligated.Value == "Yes" {
		if ok, err := entity.ObligatedExplanation.Valid(); !ok {
			return false, err
		}
	}

	return true, nil
}

// Save will create or update the database.
func (entity *Benefit) Save(context *pg.DB, account int64) (int, error) {
	entity.AccountID = account

	var err error
	err = context.CreateTable(&Benefit{}, &orm.CreateTableOptions{
		Temp:        false,
		IfNotExists: true,
	})
	if err != nil {
		return entity.ID, err
	}

	if entity.PayloadBegin.Type != "" {
		beginID, err := entity.Begin.Save(context, account)
		if err != nil {
			return beginID, err
		}
		entity.BeginID = beginID
	}

	if entity.PayloadEnd.Type != "" {
		endID, err := entity.End.Save(context, account)
		if err != nil {
			return endID, err
		}
		entity.EndID = endID
	}

	if entity.PayloadFrequency.Type != "" {
		frequencyID, err := entity.Frequency.Save(context, account)
		if err != nil {
			return frequencyID, err
		}
		entity.FrequencyID = frequencyID
	}

	if entity.PayloadOtherFrequency.Type != "" {
		otherFrequencyID, err := entity.OtherFrequency.Save(context, account)
		if err != nil {
			return otherFrequencyID, err
		}
		entity.OtherFrequencyID = otherFrequencyID
	}

	if entity.PayloadReceived.Type != "" {
		receivedID, err := entity.Received.Save(context, account)
		if err != nil {
			return receivedID, err
		}
		entity.ReceivedID = receivedID
	}

	countryID, err := entity.Country.Save(context, account)
	if err != nil {
		return countryID, err
	}
	entity.CountryID = countryID

	valueID, err := entity.Value.Save(context, account)
	if err != nil {
		return valueID, err
	}
	entity.ValueID = valueID

	valueEstimatedID, err := entity.ValueEstimated.Save(context, account)
	if err != nil {
		return valueEstimatedID, err
	}
	entity.ValueEstimatedID = valueEstimatedID

	reasonID, err := entity.Reason.Save(context, account)
	if err != nil {
		return reasonID, err
	}
	entity.ReasonID = reasonID

	obligatedID, err := entity.Obligated.Save(context, account)
	if err != nil {
		return obligatedID, err
	}
	entity.ObligatedID = obligatedID

	obligatedExplanationID, err := entity.ObligatedExplanation.Save(context, account)
	if err != nil {
		return obligatedExplanationID, err
	}
	entity.ObligatedExplanationID = obligatedExplanationID

	if entity.ID == 0 {
		err = context.Insert(entity)
	} else {
		err = context.Update(entity)
	}

	return entity.ID, err
}

// Delete will remove the entity from the database.
func (entity *Benefit) Delete(context *pg.DB, account int64) (int, error) {
	entity.AccountID = account

	options := &orm.CreateTableOptions{
		Temp:        false,
		IfNotExists: true,
	}

	var err error
	if err = context.CreateTable(&Benefit{}, options); err != nil {
		return entity.ID, err
	}

	if entity.BeginID != 0 {
		if _, err = entity.Begin.Delete(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.EndID != 0 {
		if _, err = entity.End.Delete(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.FrequencyID != 0 {
		if _, err = entity.Frequency.Delete(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.OtherFrequencyID != 0 {
		if _, err = entity.OtherFrequency.Delete(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.ReceivedID != 0 {
		if _, err = entity.Received.Delete(context, account); err != nil {
			return entity.ID, err
		}
	}

	if _, err = entity.Country.Delete(context, account); err != nil {
		return entity.ID, err
	}

	if _, err = entity.Value.Delete(context, account); err != nil {
		return entity.ID, err
	}

	if _, err = entity.ValueEstimated.Delete(context, account); err != nil {
		return entity.ID, err
	}

	if _, err = entity.Reason.Delete(context, account); err != nil {
		return entity.ID, err
	}

	if _, err = entity.Obligated.Delete(context, account); err != nil {
		return entity.ID, err
	}

	if _, err = entity.ObligatedExplanation.Delete(context, account); err != nil {
		return entity.ID, err
	}

	if entity.ID != 0 {
		err = context.Delete(entity)
	}

	return entity.ID, err
}

// Get will retrieve the entity from the database.
func (entity *Benefit) Get(context *pg.DB, account int64) (int, error) {
	entity.AccountID = account

	options := &orm.CreateTableOptions{
		Temp:        false,
		IfNotExists: true,
	}

	var err error
	if err = context.CreateTable(&Benefit{}, options); err != nil {
		return entity.ID, err
	}

	if entity.ID != 0 {
		err = context.Select(entity)
	}

	if entity.BeginID != 0 {
		if _, err := entity.Begin.Get(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.EndID != 0 {
		if _, err := entity.End.Get(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.FrequencyID != 0 {
		if _, err := entity.Frequency.Get(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.OtherFrequencyID != 0 {
		if _, err := entity.OtherFrequency.Get(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.ReceivedID != 0 {
		if _, err := entity.Received.Get(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.CountryID != 0 {
		if _, err := entity.Country.Get(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.ValueID != 0 {
		if _, err := entity.Value.Get(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.ValueEstimatedID != 0 {
		if _, err := entity.ValueEstimated.Get(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.ReasonID != 0 {
		if _, err := entity.Reason.Get(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.ObligatedID != 0 {
		if _, err := entity.Obligated.Get(context, account); err != nil {
			return entity.ID, err
		}
	}

	if entity.ObligatedExplanationID != 0 {
		if _, err := entity.ObligatedExplanation.Get(context, account); err != nil {
			return entity.ID, err
		}
	}

	return entity.ID, err
}
