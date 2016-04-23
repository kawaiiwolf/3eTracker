CREATE TABLE characters (
  `name`   VARCHAR(128) NOT NULL,
  `data`   TEXT         NOT NULL,
  
  PRIMARY KEY ( `name` )
);

CREATE TABLE encounters (
  `name`    VARCHAR(128) NOT NULL,
  `action`  VARCHAR(128) NOT NULL,
  `data`    TEXT NOT NULL,
  `ts`      INT          NOT NULL AUTO_INCREMENT,
  
  PRIMARY KEY ( `ts` ),
  INDEX ix_conflict_name ( `name`, `ts` )
);
