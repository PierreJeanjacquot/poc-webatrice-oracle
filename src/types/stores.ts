export interface SetInfo {
  code: string;
  baseSetSize: number;
  isOnlineOnly: boolean;
  isPaperOnly?: boolean;
  keyruneCode: string;
  name: string;
  releaseDate: string;
  totalSetSize: number;
  type: string;
  translations?: object;
  // integrity check
  checksum?: string;
}

export interface CardInfo {
  // mtgjson uuid
  uuid: string;
  // name used as id in cockatrice model
  name: string;
  setCode: string;
  identifiers: {
    // scryfallId for image
    scryfallId: string;
  };
  // todo
}

// class CardInfo : public QObject {
//     Q_OBJECT
// private:
//     QString name;
//
//     /*
//      * The name without punctuation or capitalization, for better card tag name
//      * recognition.
//      */
//     QString simpleName;
//
//     bool isToken;
//     SetList sets;
//     QString manacost;
//     QString cmc;
//     QString cardtype;
//     QString powtough;
//     QString text;
//     QStringList colors;
//     // the cards i'm related to
//     QList<CardRelation *> relatedCards;
//     // the card i'm reverse-related to
//     QList<CardRelation *> reverseRelatedCards;
//     // the cards thare are reverse-related to me
//     QList<CardRelation *> reverseRelatedCardsToMe;
//     QString setsNames;
//     bool upsideDownArt;
//     int loyalty;
//     QStringMap customPicURLs;
//     MuidMap muIds;
//     QStringMap collectorNumbers;
//     QStringMap rarities;
//     bool cipt;
//     int tableRow;
//     QString pixmapCacheKey;
// public:
//     CardInfo(const QString &_name = QString(),
//         bool _isToken = false,
//         const QString &_manacost = QString(),
//         const QString &_cmc = QString(),
//         const QString &_cardtype = QString(),
//         const QString &_powtough = QString(),
//         const QString &_text = QString(),
//         const QStringList &_colors = QStringList(),
//         const QList<CardRelation *> &_relatedCards = QList<CardRelation *>(),
//         const QList<CardRelation *> &_reverseRelatedCards = QList<CardRelation *>(),
//         bool _upsideDownArt = false,
//         int _loyalty = 0,
//         bool _cipt = false,
//         int _tableRow = 0,
//         const SetList &_sets = SetList(),
//         const QStringMap &_customPicURLs = QStringMap(),
//         MuidMap muids = MuidMap(),
//         QStringMap _collectorNumbers = QStringMap(),
//         QStringMap _rarities = QStringMap()
//         );
//     ~CardInfo();
//     inline const QString &getName() const { return name; }
//     inline const QString &getSetsNames() const { return setsNames; }
//     const QString &getSimpleName() const { return simpleName; }
//     bool getIsToken() const { return isToken; }
//     const SetList &getSets() const { return sets; }
//     inline const QString &getManaCost() const { return manacost; }
//     inline const QString &getCmc() const { return cmc; }
//     inline const QString &getCardType() const { return cardtype; }
//     inline const QString &getPowTough() const { return powtough; }
//     const QString &getText() const { return text; }
//     const QString &getPixmapCacheKey() const { return pixmapCacheKey; }
//     const int &getLoyalty() const { return loyalty; }
//     bool getCipt() const { return cipt; }
//     void setManaCost(const QString &_manaCost) { manacost = _manaCost; emit cardInfoChanged(this); }
//     void setCmc(const QString &_cmc) { cmc = _cmc; emit cardInfoChanged(this); }
//     void setCardType(const QString &_cardType) { cardtype = _cardType; emit cardInfoChanged(this); }
//     void setPowTough(const QString &_powTough) { powtough = _powTough; emit cardInfoChanged(this); }
//     void setText(const QString &_text) { text = _text; emit cardInfoChanged(this); }
//     void setColors(const QStringList &_colors) { colors = _colors; emit cardInfoChanged(this); }
//     const QChar getColorChar() const;
//     const QStringList &getColors() const { return colors; }
//     const QList<CardRelation *> &getRelatedCards() const { return relatedCards; }
//     const QList<CardRelation *> &getReverseRelatedCards() const { return reverseRelatedCards; }
//     const QList<CardRelation *> &getReverseRelatedCards2Me() const { return reverseRelatedCardsToMe; }
//     void resetReverseRelatedCards2Me();
//     void addReverseRelatedCards2Me(CardRelation * cardRelation) { reverseRelatedCardsToMe.append(cardRelation); }
//     bool getUpsideDownArt() const { return upsideDownArt; }
//     QString getCustomPicURL(const QString &set) const { return customPicURLs.value(set); }
//     int getMuId(const QString &set) const { return muIds.value(set); }
//     QString getCollectorNumber(const QString &set) const { return collectorNumbers.value(set); }
//     QString getRarity(const QString &set) const { return rarities.value(set); }
//     QStringMap getRarities() const { return rarities; }
//     QString getMainCardType() const;
//     QString getCorrectedName() const;
//     int getTableRow() const { return tableRow; }
//     void setTableRow(int _tableRow) { tableRow = _tableRow; }
//     void setLoyalty(int _loyalty) { loyalty = _loyalty; emit cardInfoChanged(this); }
//     void setCustomPicURL(const QString &_set, const QString &_customPicURL) { customPicURLs.insert(_set, _customPicURL); }
//     void setMuId(const QString &_set, const int &_muId) { muIds.insert(_set, _muId); }
//     void setSetNumber(const QString &_set, const QString &_setNumber) { collectorNumbers.insert(_set, _setNumber); }
//     void setRarity(const QString &_set, const QString &_setNumber) { rarities.insert(_set, _setNumber); }
//     void addToSet(CardSet *set);
//     void emitPixmapUpdated() { emit pixmapUpdated(); }
//     void refreshCachedSetNames();
//
//     /**
//      * Simplify a name to have no punctuation and lowercase all letters, for
//      * less strict name-matching.
//      */
//     static QString simplifyName(const QString &name);
// signals:
//     void pixmapUpdated();
//     void cardInfoChanged(CardInfo *card);
// };

export interface CardImage {
  uuid: string;
  normal: ArrayBuffer;
}
