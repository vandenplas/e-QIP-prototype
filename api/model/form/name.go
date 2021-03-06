package form

import (
	"encoding/json"
	"strings"

	"github.com/18F/e-QIP-prototype/api/model"

	"github.com/go-pg/pg"
	"github.com/go-pg/pg/orm"
)

// Name is a basic input.
type Name struct {
	ID                int
	First             string `json:"first"`
	FirstInitialOnly  bool   `json:"firstInitialOnly"`
	Middle            string `json:"middle"`
	MiddleInitialOnly bool   `json:"middleInitialOnly"`
	NoMiddleName      bool   `json:"noMiddleName"`
	Last              string `json:"last"`
	LastInitialOnly   bool   `json:"lastInitialOnly"`
	Suffix            string `json:"suffix"`
	SuffixOther       string `json:"suffixOther"`
}

// Unmarshal bytes in to the entity properties.
func (entity *Name) Unmarshal(raw []byte) error {
	return json.Unmarshal(raw, entity)
}

// Valid checks the value(s) against an battery of tests.
func (entity *Name) Valid() (bool, error) {
	var stack model.ErrorStack

	first := strings.TrimSpace(entity.First)
	if first == "" {
		stack.Append("First", model.ErrFieldRequired{"First name is required"})
	} else if entity.FirstInitialOnly && len(first) > 1 {
		stack.Append("First", model.ErrFieldInvalid{"First name should be an initial only"})
	}

	middle := strings.TrimSpace(entity.Middle)
	if entity.NoMiddleName && middle != "" {
		stack.Append("Middle", model.ErrFieldInvalid{"Middle name has a value when it should not"})
	} else if middle == "" {
		stack.Append("Middle", model.ErrFieldRequired{"Middle name is required"})
	} else if entity.MiddleInitialOnly && len(middle) > 1 {
		stack.Append("Middle", model.ErrFieldInvalid{"Middle name should be an initial only"})
	}

	last := strings.TrimSpace(entity.Last)
	if last == "" {
		stack.Append("Last", model.ErrFieldRequired{"Last name is required"})
	} else if entity.LastInitialOnly && len(last) > 1 {
		stack.Append("Last", model.ErrFieldInvalid{"Last name should be an initial only"})
	}

	suffix := strings.TrimSpace(entity.Suffix)
	if suffix != "" {
		if suffix == "Other" && strings.TrimSpace(entity.SuffixOther) == "" {
			stack.Append("Suffix", model.ErrFieldRequired{"Suffix is required"})
		}
	}

	return !stack.HasErrors(), stack
}

func (entity *Name) Save(context *pg.DB, account int64) (int, error) {
	options := &orm.CreateTableOptions{
		Temp:        false,
		IfNotExists: true,
	}

	if err := context.CreateTable(&Name{}, options); err != nil {
		return entity.ID, err
	}

	var err error
	if entity.ID == 0 {
		err = context.Insert(entity)
	} else {
		err = context.Update(entity)
	}

	return entity.ID, err
}

func (entity *Name) Delete(context *pg.DB, account int64) (int, error) {
	options := &orm.CreateTableOptions{
		Temp:        false,
		IfNotExists: true,
	}

	var err error
	if err = context.CreateTable(&Name{}, options); err != nil {
		return entity.ID, err
	}

	if entity.ID != 0 {
		err = context.Delete(entity)
	}

	return entity.ID, err
}

func (entity *Name) Get(context *pg.DB, account int64) (int, error) {
	options := &orm.CreateTableOptions{
		Temp:        false,
		IfNotExists: true,
	}

	var err error
	if err = context.CreateTable(&Name{}, options); err != nil {
		return entity.ID, err
	}

	if entity.ID != 0 {
		err = context.Select(entity)
	}

	return entity.ID, err
}
