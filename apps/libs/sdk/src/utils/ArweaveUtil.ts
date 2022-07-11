import axios from 'axios';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';
import { ArweaveUtilInterface, Caster, Item } from '../program';

class ArweaveUtil implements ArweaveUtilInterface {
  merkle: MerkleTree;

  constructor() {}

  isMerkleInit() {
    return !!this.merkle;
  }

  async initMerkle() {
    this.merkle = (
      await axios.get(
        'https://arweave.net/xL96M9byVljqp_x1EYCWwnC1lvmuocy6P58uM9EPoOo',
      )
    ).data;
  }

  async buildMerkleTree(url: string): Promise<MerkleTree> {
    const merkelTree = (await axios.get(url)).data;

    return new MerkleTree(merkelTree, keccak256, {
      sortPairs: true,
      hashLeaves: true,
    });
  }

  buildLeafCaster(caster: Caster, uri: string) {
    return keccak256(
      `${uri}:caster:${caster.seasonNumber}:${caster.version}:${caster.level}:${
        caster.edition === 1 ? 'normal' : 'limited'
      }`,
    );
  }

  buildLeafItem(item: Item, uri: string) {
    switch (Object.keys(item.itemType)[0]) {
      case 'equipment': {
        return keccak256(
          `${uri}:${Object.keys(item.itemType.equipment.equipmentType)[0]}:${
            item.level
          }:${Object.keys(item.itemType.equipment.feature)[0]}:${
            Object.keys(item.itemType.equipment.rarity)[0]
          }:${item.itemType.equipment.value}`,
        );
      }
      case 'spellbook': {
        return keccak256(
          `${uri}:spellbook:${item.level}:${
            Object.keys(item.itemType.spellBook.spell)[0]
          }:${Object.keys(item.itemType.spellBook.costFeature)[0]}:${
            Object.keys(item.itemType.spellBook.rarity)[0]
          }:${item.itemType.spellBook.cost}:${item.itemType.spellBook.value}`,
        );
      }
      case 'chest': {
        return keccak256(
          `${uri}:chest:${item.level}:${item.itemType.chest.tier}`,
        );
      }
    }
  }

  async getCasterUri(caster: Caster) {
    const lookupTable = (
      await axios.get(this.merkle['merkleStruct']['combined'])
    ).data;

    return lookupTable['caster'][caster.seasonNumber][caster.version][
      caster.level
    ][caster.edition === 1 ? 'normal' : 'limited'];
  }

  async getItemUri(item: Item, itemType: string) {
    const url =
      itemType === 'combined' || itemType === 'spellbook'
        ? this.merkle['merkleStruct'][itemType]
        : this.merkle['merkleStruct'][itemType][item.level];
    const lookupTable = (await axios.get(url)).data;

    switch (Object.keys(item.itemType)[0]) {
      case 'equipment': {
        const lookupRarity =
          lookupTable[Object.keys(item.itemType.equipment.feature)[0]][
            Object.keys(item.itemType.equipment.rarity)[0]
          ];
        if (lookupRarity) return lookupRarity[item.itemType.equipment.value];
        else
          return lookupTable[Object.keys(item.itemType.equipment.feature)[0]][
            this.capitalizeFirstLetter(
              Object.keys(item.itemType.equipment.rarity)[0],
            )
          ][item.itemType.equipment.value];
      }
      case 'spellBook': {
        const lookupRarity =
          lookupTable[item.level][
            Object.keys(item.itemType.spellBook.spell)[0]
          ][Object.keys(item.itemType.spellBook.costFeature)[0]][
            Object.keys(item.itemType.spellBook.rarity)[0]
          ];
        if (lookupRarity)
          return lookupRarity[item.itemType.spellBook.cost][
            item.itemType.spellBook.value
          ];
        else
          return lookupTable[item.level][
            Object.keys(item.itemType.spellBook.spell)[0]
          ][Object.keys(item.itemType.spellBook.costFeature)[0]][
            this.capitalizeFirstLetter(
              Object.keys(item.itemType.spellBook.rarity)[0],
            )
          ][item.itemType.spellBook.cost][item.itemType.spellBook.value];
      }
      case 'chest': {
        return lookupTable['chest'][item.level][item.itemType.chest.tier];
      }
    }
  }

  private capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}

const arweaveUtil = new ArweaveUtil();
export default arweaveUtil;
