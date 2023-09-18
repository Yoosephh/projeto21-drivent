import { Address, Enrollment } from '@prisma/client';
import { request } from '@/utils/request';

import { addressRepository, CreateAddressParams, enrollmentRepository, CreateEnrollmentParams } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import { InvalidCepError } from '@/errors/invalid-cep-error';
import { invalidDataError } from '@/errors';

interface ApiAdress {
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,
  cep: string;
  gia: string;
  ibge: string;
  ddd: string;
  siafi: string;
  erro: boolean;
} 
type AddressUser = {
  logradouro: string,
  complemento: string,
  bairro: string,
  cidade: string,
  uf: string,
};

async function getAddressFromCEP(cep:string) {
  if(!cep || cep === '') {
    throw InvalidCepError();
  }
  const result = (await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`)).data as ApiAdress;
  
  if (result.erro === true){
    throw InvalidCepError();
  }

  const address = {
    logradouro: result.logradouro,
    complemento: result.complemento,
    bairro: result.bairro,
    cidade: result.localidade,
    uf: result.uf,
  } as AddressUser
  
  return address;
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!enrollmentWithAddress) throw invalidDataError('Invalid provided data.')
  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  enrollment.birthday = new Date(enrollment.birthday);
  const address = getAddressForUpsert(params.address);

  // TODO - Verificar se o CEP é válido antes de associar ao enrollment.
  if(!params.address.cep || params.address.cep === '') {
    throw InvalidCepError();
  }
  const result = (await request.get(`${process.env.VIA_CEP_API}/${params.address.cep}/json/`)).data as ApiAdress;
  
  if (result.erro){
    throw InvalidCepError();
  }

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

export const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};
