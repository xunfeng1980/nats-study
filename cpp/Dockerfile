From ubuntu:24.04 as builder
 
RUN  sed -i 's@//ports.ubuntu.com@//mirrors.ustc.edu.cn@g' /etc/apt/sources.list.d/ubuntu.sources

RUN apt-get update && apt install ca-certificates gpg wget curl zip unzip tar  -y

RUN apt-get install git gcc g++ make ninja-build -y


RUN test -f /usr/share/doc/kitware-archive-keyring/copyright || wget -O - https://apt.kitware.com/keys/kitware-archive-latest.asc 2>/dev/null | gpg --dearmor - | tee /usr/share/keyrings/kitware-archive-keyring.gpg >/dev/null
RUN echo 'deb [signed-by=/usr/share/keyrings/kitware-archive-keyring.gpg] https://apt.kitware.com/ubuntu/ noble main' | tee /etc/apt/sources.list.d/kitware.list >/dev/null
RUN  apt-get update && apt install cmake  pkg-config  -y
 
RUN mkdir /vcpkg && cd / &&  git clone https://github.com/microsoft/vcpkg.git && cd /vcpkg && ./bootstrap-vcpkg.sh && ./vcpkg integrate install
ENV VCPKG_ROOT=/vcpkg
ENV PATH=$VCPKG_ROOT:$PATH


COPY . /cpp
WORKDIR /cpp

RUN --mount=type=cache,target=/vcpkg/buildtrees cmake --preset=default && cmake --build --preset=default
